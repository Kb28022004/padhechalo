import React, { useEffect } from "react";
import "./Dashboard.css";
import MetaData from "../../../utils/MetaData";
import Sidebar from "../sidebar/Sidebar";
import { Box, Grid2 } from "@mui/material";
import Card from "../../layout/card/Card";
import SchoolIcon from "@mui/icons-material/School";
import MessageIcon from "@mui/icons-material/Message";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCourseContext } from "../../../context/courseContext";
import { useOrderContext } from "../../../context/orderContext";

const Dashboard = () => {

  const {getAdminCourses,courses}=useCourseContext()
  const {getAdminOrders,orders}=useOrderContext()

  useEffect(() => {
   getAdminCourses()
   getAdminOrders()
  }, [])
  
  

  return (
    <>
      <MetaData title="Dashboard" />
      <div className="dashboard">
        <Sidebar />
        <Box
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid2
            container
            spacing={{ xs: 3, sm: 4, md: 6 }}
            justifyContent="center"
          >
            <Grid2 item xs={12} sm={6} md={3}>
              <Card
                icon={<SchoolIcon size={35} />}
                content="Students"
                backgroundColor="#F0F9FF"
                linkTo="/students"
              />
            </Grid2>
            <Grid2 item xs={12} sm={6} md={3}>
              <Card
                icon={<MessageIcon size={35} />}
                content="Courses"
                data={courses && courses.length}
                iconColor="#EE95C5"
                backgroundColor="#FEF6FB"
                linkTo="/admin/courses"
              />
            </Grid2>
            <Grid2 item xs={12} sm={6} md={3}>
              <Card
                icon={<PaymentIcon size={35} />}
                content="Orders "
                data={orders.length}
                iconColor="#F6C762"
                backgroundColor="#FEFBEC"
                linkTo="/admin/payments"
              />
            </Grid2>
            <Grid2 item xs={12} sm={6} md={3}>
              <Card
                icon={<AccountCircleIcon size={35} />}
                content="Users"
                data="3"
                iconColor="#FFFFFF"
                backgroundColor="#FEAF00"
                linkTo="/users"
              />
            </Grid2>
          </Grid2>
        </Box>
      </div>
    </>
  );
};

export default Dashboard;
