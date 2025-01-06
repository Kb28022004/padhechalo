import React, { useEffect } from "react";
import MetaData from "../../../utils/MetaData";
import { useAuthContext } from "../../../context/authContext";
import Loader from "../../helper/loader/Loader";
import { useOrderContext } from "../../../context/orderContext";
import { DataGrid } from "@mui/x-data-grid";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";
import { Grid2, Typography } from "@mui/material";

const MyOrders = () => {
  const { user } = useAuthContext();
  const { loading, getMyOrders, orders } = useOrderContext();

  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders();
  }, []);

  // Ensure each order has a unique `id` field
  const rows = orders.map((order) => ({
    id: order._id, // Assuming each order has a unique `_id` property
    totalCourses: order.orderItems.length,
    status: order.orderStatus,
    total: order.totalPrice,
  }));

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 250, flex: 1 },
    {
      field: "totalCourses",
      headerName: "No. Of Courses",
      minWidth: 250,
      flex: 0.5,
    },
    {
      field: "total",
      headerName: "Amount",

      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 0.5,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenCell" : "redCell",
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      sortable: false,
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <LaunchIcon onClick={() => navigate(`/order/${params.row.id}`)} />
      ),
    },
  ];

  return (
    <>
      <MetaData title={`${user?.name} -- Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <Grid2 mt={5} container spacing={3} justifyContent="center">
            <Grid2 item xs={12}>
              <Typography variant="h5" id="myOrdersHeading">
                {`${user.name}'s Orders`}
              </Typography>
            </Grid2>
            <Grid2 item xs={12}>
              <div className="ordersTableContainer">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  className="myOrdersTable"
                  autoHeight
                />
              </div>
            </Grid2>
          </Grid2>
        </div>
      )}
    </>
  );
};

export default MyOrders;
