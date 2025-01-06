import { Backdrop, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/authContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartItem from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";

import "./UserDetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartContext } from "../../context/cartContext";
import { useOrderContext } from "../../context/orderContext";

const UserDetails = () => {
  const [open, setOpen] = useState(false);
  const { user, userDetails, logoutUser } = useAuthContext();
  const { cartItems } = useCartContext();
  const { orders: order } = useOrderContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      userDetails();
    }
  }, [user, userDetails]);

  const dashboard = () => navigate("/admin/dashboard");
  const home = () => navigate("/");
  const cart = () => navigate("/cart");
  const orders = () => navigate("/orders");
  const account = () => navigate("/account");
  const logout = () => {
    logoutUser();
    toast.success("Logout Successfully");
    navigate("/login");
  };

  const profilePicURL = user?.profilePicture
    ? `http://localhost:8000${user.profilePicture}`
    : "https://via.placeholder.com/100";

  const options = [
    {
      icon: <HomeIcon />,
      name: "Home",
      func: home,
      path: "/",
      isDisabled: location.pathname === "/",
    },
    {
      icon: (
        <ListAltIcon style={{ color: order.length > 0 ? "green" : "unset" }} />
      ),
      name: `Orders (${order.length})`,
      func: orders,
      path: "/orders",
      isDisabled: location.pathname === "/orders",
    },
    {
      icon: (
        <ShoppingCartItem
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart (${cartItems.length})`,
      func: cart,
      path: "/cart",
      isDisabled: location.pathname === "/cart",
    },
    {
      icon: <PersonIcon />,
      name: "Profile",
      func: account,
      path: "/account",
      isDisabled: location.pathname === "/account",
    },
    {
      icon: <ExitToAppIcon />,
      name: "Logout",
      func: logout,
      isDisabled: false,
    },
  ];

  if (user?.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
      path: "/admin/dashboard",
      isDisabled: location.pathname === "/admin/dashboard",
    });
  }

  return (
    <>
      <Backdrop style={{ zIndex: 10 }} open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        direction="down"
        open={open}
        className="speedDial"
        icon={
          <img className="speedDialIcon" src={profilePicURL} alt="profile" />
        }
      >
        {options.map((item, index) => (
          <SpeedDialAction
            key={index}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={!item.isDisabled ? item.func : undefined} // Disable the click if active
            // tooltipOpen={item.isDisabled} // Keep the tooltip open for the active item
            sx={{
              cursor: item.isDisabled ? "not-allowed" : "pointer",
              opacity: item.isDisabled ? 0.6 : 1, // Visually indicate disabled
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default UserDetails;
