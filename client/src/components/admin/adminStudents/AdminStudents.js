import React, { useEffect } from "react";
import "./AdminStudents.css";
import MetaData from "../../../utils/MetaData";
import Sidebar from "../sidebar/Sidebar";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuthContext } from "../../../context/authContext";

const AdminStudents = () => {
  const { loading, error, getAllAdminUsers, users } = useAuthContext();

  const columns = [
    { field: "id", headerName: "User's Id", minWidth: 100, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 100, flex: 0.5 },
    { field: "email", headerName: "Email", minWidth: 100, flex: 0.5 },
    { field: "phone", headerName: "Phone Number", type: "number", minWidth: 150, flex: 0.5 },
    { field: "enroll", headerName: "Enrollment Number", type: "number", minWidth: 180, flex: 0.5 },
    { field: "admission", headerName: "Admission Date", minWidth: 120, flex: 0.5 },
    { field: "action", headerName: "Actions", sortable: false, minWidth: 100, flex: 0.5 },
  ];

  const rows = users?.map((user) => ({
    id: user._id, // Assuming _id is the unique identifier for each user
    name: user.name,
    email: user.email,
    phone: user.phone,
    enroll: user.enroll,
    admission: user.admission, // Ensure these fields are returned by your backend
  }));

//   useEffect(() => {
//     getAllAdminUsers();
//   }, [users,getAllAdminUsers]);


  return (
    <>
      <MetaData title="Students" />
      <div className="dashboard">
        <Sidebar />
        <Box className="studentContainer">
          <Box className="studentHeaderContent">
            <Typography className="studentTitle">Students</Typography>
          </Box>
          <hr className="horiLine" />
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            className="adminOrdersTable"
            disableSelectionOnClick
          />
        </Box>
      </div>
    </>
  );
};

export default AdminStudents;
