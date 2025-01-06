import React from "react";
import "./Cart.css";
import { useCartContext } from "../../../context/cartContext";
import CartItemsCard from "../cartItemsCard/CartItemsCard";
import { Link, useNavigate } from "react-router-dom";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Typography } from "@mui/material";

const Cart = () => {
  const { cartItems, addItemsToCart } = useCartContext();
  const navigate = useNavigate();

  const calculateGrossTotal = () =>
    cartItems.reduce((acc, item) => acc + item.courseFees * item.quantity, 0);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    addItemsToCart(id, newQty);
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty < 1) {
      return;
    }
    addItemsToCart(id, newQty);
  };

  const checkout = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Product in your Cart</Typography>
          <Link to="/courses">View Courses</Link>
        </div>
      ) : (
        <div className="cartPage">
          <div className="cartHeader">
            <p>Course</p>
            <p>Quantity</p>
            <p>Subtotal</p>
          </div>
          {cartItems &&
            cartItems.map((item) => (
              <div className="cartContainer" key={item.course}>
                <CartItemsCard item={item} />
                <div className="cartInput">
                  <button
                    onClick={() => decreaseQuantity(item.course, item.quantity)}
                  >
                    -
                  </button>
                  <input type="number" readOnly value={item.quantity} />
                  <button
                    onClick={() =>
                      increaseQuantity(item.course, item.quantity, item.stock)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="cartSubtotal">
                  {`₹${item.courseFees * item.quantity}`}
                </div>
              </div>
            ))}
          <div className="cartGrossTotal">
            <div></div>
            <div className="cartGrossTotalBox">
              <p>Gross Total</p>
              <p>{`₹${calculateGrossTotal()}`}</p>
            </div>

            <div></div>
            <div className="checkOutButton">
              <button onClick={checkout}>Purchase</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
