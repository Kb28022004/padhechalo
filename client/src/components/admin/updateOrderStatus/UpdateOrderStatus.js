import React, { useEffect, useState } from "react";
import MetaData from "../../../utils/MetaData";
import "./UpdateOrderStatus.css";
import Sidebar from "../sidebar/Sidebar";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useOrderContext } from "../../../context/orderContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateOrderStatus = () => {
  const [orderStatus, setorderStatus] = useState("");
  const status = ["processing", "shipped", "Delivered"];

  const {
    loading,
    error,
    isUpdated,
    dispatch,
    order,
    getOrderDetails,
    updatedOrderStatus,
  } = useOrderContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    updatedOrderStatus(id, orderStatus);
  };

  useEffect(() => {
    if (order && order._id !== id) {
      getOrderDetails(id);
    } else {
      setorderStatus(order.orderStatus);
    }

    if (error) {
      toast.error(error);
    }
    dispatch({ type: "CLEAR_ERRORS" });

    if (isUpdated) {
      toast.success("Status of the order has been updated successfully !");
      navigate("/admin/payments");
      dispatch({type:"UPDATE_ORDER_STATUS_RESET"})
    }
  }, [id, order, error, dispatch, isUpdated]);

  return (
    <>
      <MetaData title="Update Order Status" />
   
        <div className="newOrderContainer">
          <form encType="multipart/form-data" onSubmit={handleSubmit} className="createOrderForm">
            <Typography variant="h4">Update Order Status</Typography>
            <FormControl sx={{ marginTop: "15px" }} fullWidth>
              <InputLabel id="select-label">Select Status</InputLabel>
              <Select
                value={orderStatus}
                onChange={(e) => setorderStatus(e.target.value)}
                fullWidth
                labelId="select-label"
                label="Select Option"
              >
                {status &&
                  status.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              disabled={order.orderStatus==='Delivered'}
              color="warning"
              sx={{ borderRadius: "10px", fontWeight: "bold" }}
              variant="contained"
            >
              UPDATE
            </Button>
          </form>
        </div>
   
    </>
  );
};

export default UpdateOrderStatus;
