import React, { useEffect } from "react";
import Loader from "../../helper/loader/Loader";
import { useOrderContext } from "../../../context/orderContext";
import "./OrderDetails.css";
import MetaData from "../../../utils/MetaData";
import { Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const OrderDetails = () => {
  const { loading, order, error, getOrderDetails } = useOrderContext();

  const { id } = useParams();

  useEffect(() => {
    getOrderDetails(id);
  }, [id]);

  return (
    <>
      <MetaData title="Order details" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">Order # {order?._id} </Typography>
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name : </p>
                  <span>{order.user && order.user.name}</span>
                </div>
                <div>
                  <p>Phone : </p>
                  <span>
                    {order.shippingInfo && order.shippingInfo.phoneNo}
                  </span>
                </div>
                <div>
                  <p>Address : </p>
                  <span>
                    {order.shippingInfo &&
                      `${order.shippingInfo.address},${order.shippingInfo.city},${order.shippingInfo.pinCode},${order.shippingInfo.state},${order.shippingInfo.country}`}
                  </span>
                </div>
              </div>
              <Typography>Payment :</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    style={{
                      color:
                        order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "green"
                          : "red",
                    }}
                  >
                    {order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>
                <div>
                  <p>Amount : </p>
                  <span>{order.totalPrice && `₹${order.totalPrice}`}</span>
                </div>
              </div>
              <Typography>Order Status :</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    style={{
                      color:
                        order.orderStatus && order.orderStatus === "Delivered"
                          ? "green"
                          : "red",
                    }}
                  >
                    {order.orderStatus && order.orderStatus}
                  </p>
                </div>
              </div>
              <div className="orderDetailsCartItems">
                <Typography>Cart Items : </Typography>
                <div className="orderDetailsCartItemsContainer">
                  {order.orderItems &&
                    order.orderItems.map((item) => {
                      return (
                        <div key={item.product}>
                          <img src={item.image} alt="Course" />
                          <Link to={`/course/${item.product}`}>
                            {item.name}
                          </Link>
                          <span>
                            {item.quantity} * ₹{item.courseFees} ={" "}
                          </span>
                          <b>₹ {item.courseFees * item.quantity}</b>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDetails;
