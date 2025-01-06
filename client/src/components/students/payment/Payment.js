import React, { useEffect, useState } from "react";
import "./Payment.css";
import MetaData from "../../../utils/MetaData";
import CheckOutSteps from "../checkOutSteps/CheckOutSteps";
import { Button, Typography } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EventIcon from "@mui/icons-material/Event";
import {
  CardExpiryElement,
  CardNumberElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useOrderContext } from "../../../context/orderContext";
import axios from "axios";
import { useAuthContext } from "../../../context/authContext";
import { useCartContext } from "../../../context/cartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const [isProcessing, setIsProcessing] = useState(false); // Local button state
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { error, dispatch, createNewOrder } = useOrderContext();
  const { user } = useAuthContext();
  const { shippingInfo, cartItems, removeItemFromCart, loading } =
    useCartContext();

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch({ type: "CLEAR_ERRORS" });
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Disable the button during processing

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/payment/process/payment",
        paymentData,
        {
          withCredentials: true, // Include cookies for authentication
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) {
        toast.error("Stripe has not loaded. Please try again later.");
        setIsProcessing(false); // Re-enable the button
        return;
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user?.name,
            email: user?.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setIsProcessing(false); // Re-enable the button on error
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        // Remove all items from the cart after successful payment
        cartItems.forEach((item) => {
          removeItemFromCart(item.course);
        });

        await createNewOrder(order);
        navigate("/success"); // Redirect on success
      } else {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false); // Re-enable the button
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      setIsProcessing(false); // Re-enable the button on error
    }
  };

  return (
    <>
      <MetaData title="Payment" />
      <CheckOutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={handleSubmit}>
          <Typography variant="h5" className="paymentTitle">
            Card Info
          </Typography>
          <div className="paymentInputGroup">
            <CreditCardIcon className="paymentIcon" />
            <CardNumberElement className="paymentInput" />
          </div>
          <div className="paymentInputGroup">
            <EventIcon className="paymentIcon" />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div className="paymentInputGroup">
            <VpnKeyIcon className="paymentIcon" />
            <CardCvcElement className="paymentInput" />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="paymentFormBtn"
            disabled={isProcessing} // Disable button while processing
          >
            {isProcessing ? "Processing..." : `Pay - ₹${orderInfo?.totalPrice}`}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Payment;
