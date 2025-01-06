import React, { useEffect, useState } from "react";
import MetaData from "../../utils/MetaData";
import "./Login.css";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import { useAuthContext } from "../../context/authContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/helper/loader/Loader";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const { loading, login, error, dispatch, isAuthenticated } = useAuthContext();
  const { email, password } = input;
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login(email, password);
      if (res && res.success) {
        toast.success("You're logged in your account");
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/account";

  // Ensure the redirect path is absolute
  const absoluteRedirect = redirect.startsWith("/") ? redirect : `/${redirect}`;
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({type:"CLEAR_ERRORS"})
    }

    if (isAuthenticated) {
      navigate(absoluteRedirect); // Use the absolute redirect path
    }
  }, [error, navigate,dispatch, isAuthenticated]);

  return (
    <>
      <MetaData title="Login" />
      {loading ? (
        <Loader />
      ) : (
        <div className="login">
          <Box className="loginContainer">
            {/* Title Section */}
            <div className="content-1">
              <BatteryStdIcon className="battery--icon" />
              <Typography className="title" variant="h4">
                Padhe Chalo
              </Typography>
            </div>

            {/* Subtitle Section */}
            <div className="content-2">
              <Typography variant="h5">SIGN IN</Typography>
            </div>

            {/* Description Section */}
            <div className="content-3">
              <Typography variant="body2">
                Enter your credentials to access your account
              </Typography>
            </div>

            {/* Form Section */}
            <div className="content-4">
              <form onSubmit={onSubmitHandler}>
                <div className="login-formGrid">
                  <div className="login-field">
                    <label className="label">Email</label>
                    <TextField
                      name="email"
                      value={email}
                      onChange={handleOnChange}
                      variant="outlined"
                      size="small"
                      type="email"
                      placeholder="Enter your email"
                      fullWidth
                    />
                  </div>
                  <div className="login-field">
                    <label className="label">Password</label>
                    <TextField
                      name="password"
                      value={password}
                      onChange={handleOnChange}
                      variant="outlined"
                      size="small"
                      type="password"
                      placeholder="Enter your password"
                      fullWidth
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="login-submitButton">
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
            <div className="content-5">
              <Typography>
                Don't have an account?{" "}
                <NavLink to="/register">Register</NavLink>
              </Typography>
              <Typography>
                <NavLink
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    marginTop: "5px",
                  }}
                  to="/forget-password"
                >
                  {" "}
                  Forgot Password
                </NavLink>
              </Typography>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default Login;
