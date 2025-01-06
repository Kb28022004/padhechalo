import React from "react";
import MetaData from "../../../utils/MetaData";
import CheckOutSteps from "../checkOutSteps/CheckOutSteps";
import { Typography } from "@mui/material";
import "./ConfirmOrder.css";
import { useAuthContext } from "../../../context/authContext";
import { useCartContext } from "../../../context/cartContext";
import { Link, useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useCartContext();
  const { address: Address, city, pinCode, state, country } = shippingInfo;

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.quantity * item.courseFees;
  }, 0);

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = shippingCharges + tax + subtotal;

  const address = `${Address},${city},${pinCode},${state},${country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <>
      <MetaData title="Confirm Order" />
      <CheckOutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmShippingArea">
            <Typography variant="h5">Shipping Info</Typography>
            <div className="confirmShippingAreaBox">
              <div>
                <p>Name :</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone Number :</p>
                <span>{user.phone}</span>
              </div>
              <div>
                <p>Address :</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography variant="h5">Your Cart Courses</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.course}>
                    <img src={item.image} alt={item.name} />
                    <Link to={`/course/${item.course}`}>{item.name}</Link>
                    <span>
                      {item.quantity}*{item.courseFees} =
                    </span>
                    <b> ₹ {item.quantity * item.courseFees}</b>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="orderSummary">
          <Typography variant="h5">Purchase Summary</Typography>
          <div>
            <div>
              <p>Subtotal: </p>
              <p>₹ {subtotal}</p>
            </div>
            <div>
              <p>Shipping Charges: </p>
              <p>₹ {shippingCharges}</p>
            </div>
            <div>
              <p>GST: </p>
              <p>₹ {tax}</p>
            </div>
          </div>
          <div className="orderSummaryTotal">
            <p>
              <b>Total: </b>
            </p>
            <span> ₹ {totalPrice}</span>
          </div>
          <button onClick={proceedToPayment}>Proceed to payment</button>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
