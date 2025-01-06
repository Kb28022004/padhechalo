import React, { useEffect } from "react";
import MetaData from "../../../utils/MetaData";
import Sidebar from "../sidebar/Sidebar";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import "./AdminOrders.css";
import { DataGrid } from "@mui/x-data-grid";
import { useOrderContext } from "../../../context/orderContext";
import { Link, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "../../helper/loader/Loader";
import { toast } from "react-hot-toast";

const AdminOrders = () => {
  const { orders, getAdminOrders, loading, error, dispatch,isDeleted,deleteOrders } =
    useOrderContext();

  const rows = orders?.map((order) => ({
    id: order._id,
    status: order.orderStatus,
    amount: order.totalPrice ? `₹${order.totalPrice.toFixed(2)}` : "₹0.00", // Format directly here
    paymentInfo: order.paymentInfo?.status,
  }));

  const columns = [
    {
      field: "id",
      headerName: "Order Id",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenCell" : "redCell",
    },
    {
      field: "paymentInfo",
      headerName: "Payment Info",
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) =>
        params.value === "pending" ? "redCell" : "greenCell",
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.5,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.5,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/order/${params.row.id}`}>
              <Tooltip title="Edit">
                <EditIcon style={{ color: "green" }} />
              </Tooltip>
            </Link>
            <Button>
              <Tooltip title="Delete">
                <DeleteIcon onClick={()=>handleDeleteOrders(params.row.id)}  color="error" style={{ marginBottom: "15px" }} />
              </Tooltip>
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch({ type: "CLEAR_ERRORS" });

    if(isDeleted){
      toast.success('Your order has been deleted successfully !')
      getAdminOrders()
    }

    getAdminOrders();
  }, [error, dispatch,isDeleted]);

  const handleDeleteOrders=(id)=>{
    deleteOrders(id)
  }

  return (
    <>
      <MetaData title="Orders" />
      <div className="dashboard">
        <Sidebar />
        {loading ? (
          <Loader />
        ) : (
          <Box className="studentContainer">
            <Box className="paymentHeaderContainer">
              <Typography className="studentTitle">Orders</Typography>
            </Box>
            <hr className="horiLine" />

            <DataGrid
              rows={rows}
              columns={columns}
              autoPageSize={10}
              className="adminOrdersTable"
              disableSelectionOnClick
            />
          </Box>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
