import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/header/Header";
import Home from "./pages/home/Home";
import Courses from "./pages/courses/Courses";
import { Toaster } from "react-hot-toast";
import CourseDetails from "./components/students/courseDetails/CourseDetails";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import { useAuthContext } from "./context/authContext";
import UserDetails from "./components/details/UserDetails";
import Profile from "./components/students/profile/Profile";
import ProtectedRoute from "./route/ProtectedRoute";
import Cart from "./components/students/cart/Cart";
import Shipping from "./components/students/shipping/Shipping";
import ConfirmOrder from "./components/students/confirmOrder/ConfirmOrder";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/students/payment/Payment";
import SuccessPayment from "./components/students/successPayment/SuccessPayment";
import MyOrders from "./components/students/myorders/MyOrders";
import OrderDetails from "./components/students/orderDetails/OrderDetails";
import Dashboard from "./components/admin/dashboard/Dashboard";
import AdminCourses from "./components/admin/adminCourses/AdminCourses";
import UpdateCourse from "./components/admin/updateCourse/UpdateCourse";
import AdminStudents from "./components/admin/adminStudents/AdminStudents";
import AdminOrders from "./components/admin/adminOrders/AdminOrders";
import UpdateOrderStatus from "./components/admin/updateOrderStatus/UpdateOrderStatus";

const App = () => {
  const [stripeApiKey, setstripeApiKey] = useState("");
  const { isAuthenticated, userDetails } = useAuthContext();

  const getStripeKey = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/payment/stripeapikey",
        {
          withCredentials: true,
        }
      );
      console.log("Stripe Key fetched:", data); // Debug log
      setstripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
    }
  };

  useEffect(() => {
    userDetails();
    getStripeKey();
  }, []);

  return (
    <>
      <Router>
        {isAuthenticated && <UserDetails />}
        <Header />
        <Toaster position="top-right" />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/courses" element={<Courses />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/courses/:keyword" element={<Courses />} />
          <Route exact path="/course/:id" element={<CourseDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route exact path="/account" element={<Profile />} />
            <Route exact path="/shipping" element={<Shipping />} />
            <Route exact path="/order/confirm" element={<ConfirmOrder />} />
            <Route exact path="/success" element={<SuccessPayment />} />
            <Route exact path="/orders" element={<MyOrders />} />
            <Route exact path="/order/:id" element={<OrderDetails />} />

            {stripeApiKey && (
              <Route
                path="/process/payment"
                element={
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                  </Elements>
                }
              />
            )}
          </Route>
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/payments" element={<AdminOrders />} />
            <Route path="/admin/course/:id" element={<UpdateCourse />} />
            <Route path="/admin/order/:id" element={<UpdateOrderStatus />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
