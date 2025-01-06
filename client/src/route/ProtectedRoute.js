import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/helper/loader/Loader";
import { useAuthContext } from "../context/authContext";

const ProtectedRoute = ({ isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} />;
  }

  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
