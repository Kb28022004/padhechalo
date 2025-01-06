import { createContext, useContext, useReducer } from "react";
import reducer from "../reducer/orderReducer";
import axios from "axios";

const OrderContext = createContext();

const API = "http://localhost:8000/api/v1/order";

const initialState = {
  order: {},
  orders: [],
  loading: false,
  error: false,
  isUpdated: false,
};

const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // create a new order

  const createNewOrder = async (createdElements) => {
    try {
      dispatch({ type: "CREATE_ORDER_REQUEST" });
      const { data } = await axios.post(`${API}/create`, createdElements, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      dispatch({ type: "CREATE_ORDER_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "CREATE_ORDER_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // get my orders

  const getMyOrders = async () => {
    try {
      dispatch({ type: "MY_ORDERS_REQUEST" });
      const { data } = await axios.get(`${API}/myorders`, {
        withCredentials: true,
      });
      dispatch({ type: "MY_ORDERS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "MY_ORDERS_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // get order details

  const getOrderDetails = async (id) => {
    try {
      dispatch({ type: "ORDER_DETAILS_REQUEST" });
      const { data } = await axios.get(`${API}/getsingleorder/${id}`, {
        withCredentials: true,
      });
      dispatch({ type: "ORDER_DETAILS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "ORDER_DETAILS_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // get all orders -- access by an admin

  const getAdminOrders = async () => {
    try {
      dispatch({ type: "ALL_ADMIN_ORDERS_REQUEST" });
      const { data } = await axios.get(`${API}/admin/allorders`, {
        withCredentials: true,
      });
      dispatch({ type: "ALL_ADMIN_ORDERS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "ALL_ADMIN_ORDERS_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  const updatedOrderStatus = async (id, orderStatus) => {
    try {
      dispatch({ type: "UPDATE_ORDER_STATUS_REQUEST" });
      const { data } = await axios.put(
        `${API}/admin/update/${id}`,
        { status: orderStatus }, // Wrap it in an object
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Change to JSON for simplicity
          },
        }
      );
      dispatch({ type: "UPDATE_ORDER_STATUS_SUCCESS", payload: data.success });
    } catch (error) {
      dispatch({
        type: "UPDATE_ORDER_STATUS_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // delete the orders --- admin

  const deleteOrders = async (id) => {
    try {
      dispatch({ type: "DELETE_ORDER_REQUEST" });
      const { data } = await axios.delete(`${API}/admin/delete/${id}`, {
        withCredentials: true,
      });

      dispatch({ type: "DELETE_ORDER_SUCCESS", payload: data.success });
    } catch (error) {
      dispatch({
        type: "DELETE_ORDER_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        createNewOrder,
        dispatch,
        getMyOrders,
        getOrderDetails,
        getAdminOrders,
        updatedOrderStatus,
        deleteOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// custom hook

const useOrderContext = () => {
  return useContext(OrderContext);
};

export { useOrderContext, OrderContext, OrderProvider };
