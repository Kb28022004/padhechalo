import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CourseProvider } from "./context/courseContext";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";
import { OrderProvider } from "./context/orderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CourseProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </CourseProvider>
  </React.StrictMode>
);
