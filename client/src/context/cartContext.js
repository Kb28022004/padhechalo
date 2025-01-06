import { createContext, useContext, useReducer } from "react";
import reducer from "../reducer/cartReducer";
import axios from "axios";

const CartContext = createContext();

const API = "http://localhost:8000/api/v1/course";

const getLocalCartData = () => {
  const newCartData = localStorage.getItem("cartItem");
  return newCartData ? JSON.parse(newCartData) : [];
};

const getShippingInfoData = () => {
  const newShippingInfoData = localStorage.getItem("shippingInfo");
  return newShippingInfoData ? JSON.parse(newShippingInfoData) : [];
};

const initialState = {
  loading: false,
  error: null,
  cartItems: getLocalCartData(),
  shippingInfo: getShippingInfoData(),
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ADD ITEMS TO CART

  const addItemsToCart = async (id, quantity) => {
    try {
      // Fetch the course data from your API

      const { data } = await axios.get(`${API}/getsinglecourse/${id}`, {
        withCredentials: true,
      });

      const newData = {
        course: data.course._id,
        name: data.course.name,
        courseFees: data.course.courseFees,
        stock: data.course.stock,
        image: data.course.images[0].url,
        quantity
      };

      // Check if the item is already in the cart
      const itemIndex = state.cartItems.findIndex((item) => item.course === id);

      if (itemIndex !== -1) {
        // If the item exists, update the quantity
        const updatedCart = [...state.cartItems];
        updatedCart[itemIndex].quantity = quantity;
        localStorage.setItem("cartItem", JSON.stringify(updatedCart));
        dispatch({ type: "UPDATE_ITEMS_TO_CART", payload: updatedCart });
      } else {
        // If the item doesn't exist in the cart, add it
        const updatedCart = [...state.cartItems, newData];
        localStorage.setItem("cartItem", JSON.stringify(updatedCart));
        dispatch({ type: "ADD_ITEMS_TO_CART", payload: updatedCart });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeItemFromCart = (id) => {
    const updatedCart = state.cartItems.filter((item) => item.course !== id);
    localStorage.setItem("cartItem", JSON.stringify(updatedCart));
    dispatch({ type: "REMOVE_ITEMS_TO_CART", payload: updatedCart });
  };
  

  // shipping info

  const saveShippingInfo = async (data) => {
    dispatch({ type: "SHIPPING_INFO", payload: data });
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };

  return (
    <CartContext.Provider
      value={{ ...state, addItemsToCart, removeItemFromCart, saveShippingInfo }}
    >
      {children}
    </CartContext.Provider>
  );
};

// custom hook

const useCartContext = () => {
  return useContext(CartContext);
};

export { useCartContext, CartContext, CartProvider };
