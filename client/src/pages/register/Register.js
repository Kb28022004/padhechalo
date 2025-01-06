import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/authContext";
import "./Register.css";
import MetaData from "../../utils/MetaData";
import Loader from "../../components/helper/loader/Loader";

const Register = () => {
  const [input, setinput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    admission: "",
    enroll: "",
  });
  const [image, setimage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { name, email, password, phone, admission, enroll } = input;
  const { loading, error, register, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChangeHandler = (e) => {
    setimage(e.target.files[0]);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (!phone) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone))
      errors.phone = "Phone number must be 10 digits";

    if (!admission) errors.admission = "Admission date is required";
    if (!enroll) errors.enroll = "Enrollment number is required";
    else if (!/^\d{12}$/.test(enroll))
      errors.enroll = "enrollment number must be 12 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!validateForm()) return; // Prevent submission if the form has validation errors

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("password", password);
  formData.append("enroll", enroll);
  formData.append("admission", admission);
  if (image) {
    formData.append("profilePicture", image);
  }

  try {
    const response = await register(formData);

    if (response && response.success) {
      toast.success("Registration successful! Please log in.");
      setinput({
        name: "",
        email: "",
        password: "",
        phone: "",
        enroll: "",
        admission: "",
      });
      setimage(null);
      navigate("/login");
    } else {
      toast.error(response.message || "Failed to register. Please try again.");
    }
  } catch (err) {
    console.error("Error during registration:", err);
  }
};



  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "CLEAR_ERRORS" });
    }
  }, [error, dispatch]);

  return (
    <>
      <MetaData title="Register" />
      {
        loading ? (<Loader/>):(
          <div className="register">
        <Box className="registerContainer">
          {/* Title Section */}
          <div className="content1">
            <BatteryStdIcon className="battery-icon" />
            <Typography className="title" variant="h4">
              Padhe Chalo
            </Typography>
          </div>

          {/* Subtitle Section */}
          <div className="content2">
            <Typography variant="h5">SIGN UP</Typography>
          </div>

          {/* Description Section */}
          <div className="content3">
            <Typography variant="body2">
              Enter your credentials to access your account
            </Typography>
          </div>

          {/* Form Section */}
          <div className="content4">
            <form onSubmit={onSubmitHandler}>
              <div className="formGrid">
                <div className="field">
                  <label className="label">Name</label>
                  <TextField
                    name="name"
                    onChange={onChangeHandler}
                    value={name}
                    variant="outlined"
                    size="small"
                    type="text"
                    placeholder="Enter your name"
                    fullWidth
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                  />
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <TextField
                    name="email"
                    onChange={onChangeHandler}
                    value={email}
                    variant="outlined"
                    size="small"
                    type="email"
                    placeholder="Enter your email"
                    fullWidth
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <TextField
                    name="password"
                    onChange={onChangeHandler}
                    value={password}
                    variant="outlined"
                    size="small"
                    type="password"
                    placeholder="Enter your password"
                    fullWidth
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                  />
                </div>
                <div className="field">
                  <label className="label">Enrollment Number</label>
                  <TextField
                    name="enroll"
                    onChange={onChangeHandler}
                    value={enroll}
                    variant="outlined"
                    size="small"
                    type="number"
                    placeholder="Enter your enrollment number"
                    fullWidth
                    error={!!formErrors.enroll}
                    helperText={formErrors.enroll}
                  />
                </div>
                <div className="field">
                  <label className="label">Phone Number</label>
                  <TextField
                    name="phone"
                    onChange={onChangeHandler}
                    value={phone}
                    variant="outlined"
                    size="small"
                    type="number"
                    placeholder="Enter your phone number"
                    fullWidth
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                  />
                </div>
                <div className="field">
                  <label className="label">Admission Date</label>
                  <TextField
                    name="admission"
                    onChange={onChangeHandler}
                    value={admission}
                    variant="outlined"
                    size="small"
                    type="date"
                    fullWidth
                    error={!!formErrors.admission}
                    helperText={formErrors.admission}
                  />
                </div>
              </div>

              {/* File Input */}
              <div className="fileField">
                <TextField
                  fullWidth
                  onChange={onFileChangeHandler}
                  variant="outlined"
                  size="small"
                  accept="image/*"
                  type="file"
                  className="fileInput"
                />
              </div>

              {/* Submit Button */}
              <div className="submitButton">
                <Button
                  type="submit"
                  fullWidth
                  style={{ color: "white" }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress /> : "Submit"}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer Section */}
          <div className="content5">
            <Typography>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </Typography>
          </div>
        </Box>
      </div>
        )
      }
    </>
  );
};

export default Register;
