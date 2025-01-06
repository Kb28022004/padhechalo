import React, { useState } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../context/authContext";
import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import ReportIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = () => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const { user } = useAuthContext();
  const location = useLocation(); // Get the current location

  const sidebarData = [
    { icon: <HomeIcon />, heading: "Home", path: "/admin/dashboard" },
    { icon: <SchoolIcon />, heading: "Courses", path: "/admin/courses" },
    { icon: <PeopleIcon />, heading: "Students", path: "/admin/students" },
    { icon: <PaymentIcon />, heading: "Orders", path: "/admin/payments" },
    { icon: <ReportIcon />, heading: "Reports", path: "/admin/reports" },
    { icon: <SettingsIcon />, heading: "Settings", path: "/settings" },
  ];

  const profilePicURL = user?.profilePicture
    ? `http://localhost:8000${user.profilePicture}`
    : "https://via.placeholder.com/100";

  return (
    <Drawer variant="permanent" className="sidebarDrawer">
      {/* Button to toggle sidebar */}
      <IconButton
        onClick={() => setOpenSidebar((prev) => !prev)}
        className="sidebarToggleButton"
      >
        <MenuIcon />
      </IconButton>

      {/* Collapsible Sidebar Header */}
      <Collapse in={openSidebar} timeout={{ enter: 300, exit: 300 }}>
        <Box className="sidebarHeader">
          <Typography
            variant="h5"
            style={{ fontWeight: "bold", marginBottom: 10 }}
          >
            PADHE CHALE!
          </Typography>
          <Avatar
            src={profilePicURL}
            alt={user?.name || "User"}
            sx={{ width: 100, height: 100, marginTop: 2 }}
          />
          <Typography
            style={{ marginTop: 22, fontWeight: "bold", fontSize: 16 }}
            variant="body2"
          >
            {user?.name}
          </Typography>
          <Typography
            style={{
              marginTop: 8,
              textTransform: "capitalize",
              color: "#FEAF00",
            }}
            variant="body2"
          >
            {user?.role}
          </Typography>
        </Box>
      </Collapse>

      {/* Sidebar Links */}
      <Collapse in={openSidebar} timeout={{ enter: 300, exit: 300 }}>
        <List sx={{ margin: "30px 30px 0 30px" }}>
          {sidebarData.map((item, index) => (
            <ListItem
              key={index}
              className={`listitemContent ${
                location.pathname === item.path ? "active" : ""
              }`} // Add "active" class if the path matches
              button
              sx={{ mb: 1.5 }}
              component={Link}
              to={item.path}
            >
              <ListItemIcon sx={{ display: "flex", justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.heading}
                sx={{
                  textAlign: "left", // Center-align the text
                  margin: 0, // Remove default margins
                }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Drawer>
  );
};

export default Sidebar;
