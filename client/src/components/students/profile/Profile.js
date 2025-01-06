import React, { useEffect, useState } from "react";
import MetaData from "../../../utils/MetaData";
import { useAuthContext } from "../../../context/authContext";
import Loader from "../../helper/loader/Loader";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import toast from "react-hot-toast";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState({ name: "", email: "", phone: "" });
  const [image, setImage] = useState(null);
  const {
    user,
    loading,
    isAuthenticated,
    error,
    updateUserProfile,
    userDetails,
    isUpdated,
    dispatch,
  } = useAuthContext();

  const { name, email, createdAt, admission, enroll, phone } = user || {};
  const navigate = useNavigate();

  const profilePicURL = user?.profilePicture
    ? `http://localhost:8000${user.profilePicture}`
    : "https://via.placeholder.com/100";

  // Navigate to login if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load user details into input state
  useEffect(() => {
    if (user) {
      setInput({ name: user.name, email: user.email, phone: user.phone });
    }
  }, [user]);

  // Handle error and success updates
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "CLEAR_ERRORS" });
    }
  
    if (isUpdated) {
      toast.success("Your profile has been updated successfully!");
      setOpen(false); // Close the dialog
      dispatch({ type: "UPDATE_PROFILE_RESET" });
  
      // Fetch updated user details immediately
      userDetails();
    }
  }, [error, isUpdated, dispatch, userDetails]);
  

  const handleClose = () => setOpen(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    if (image) {
      formData.append("profilePicture", image);
    }
    updateUserProfile(formData);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${name}'s Profile`} />
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              <Avatar
                src={profilePicURL}
                alt={name}
                className="avatar"
                style={{ width: "20vmax", height: "20vmax" }}
              />
              <Link onClick={() => setOpen(true)}>Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{email}</p>
              </div>
              <div>
                <h4>Phone Number</h4>
                <p>{phone}</p>
              </div>
              <div>
                <h4>Enrollment Number</h4>
                <p>{enroll}</p>
              </div>
              <div>
                <h4>Admission Date</h4>
                <p>{admission}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(createdAt).substring(0, 10)}</p>
              </div>
              <div>
                <Link to="/orders">My Courses</Link>
              </div>
            </div>
          </div>
          <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
            <DialogTitle>Update your profile</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                onChange={handleOnChange}
                value={input.name}
                name="name"
                fullWidth
                type="text"
                margin="dense"
              />
              <TextField
                label="Email"
                onChange={handleOnChange}
                value={input.email}
                name="email"
                fullWidth
                type="email"
                margin="dense"
              />
              <TextField
                label="Phone Number"
                onChange={handleOnChange}
                value={input.phone}
                name="phone"
                fullWidth
                type="number"
                margin="dense"
              />
              <TextField
                label="Profile Picture"
                onChange={handleFileChange}
                fullWidth
                type="file"
                accept="image/*"
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary" variant="text">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Profile;
