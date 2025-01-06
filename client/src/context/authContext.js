import { createContext, useContext, useReducer } from "react";
import reducer from "../reducer/authReducer";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
  loading: false,
  error: null,
  isUpdated:false,
  users: [],
  user: {},
  isAuthenticated: false,
  success: false,
};

const API = "http://localhost:8000/api/v1/user";

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Register
  const register = async (userData) => {
    try {
      dispatch({ type: "USER_REGISTER_REQUEST" });
      const { data } = await axios.post(`${API}/register`, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "USER_REGISTER_SUCCESS", payload: data.user });
      return { success: true, message: "Registration successful" };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({ type: "USER_REGISTER_FAIL", payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      dispatch({ type: "USER_LOGIN_REQUEST" });
      const { data } = await axios.post(
        `${API}/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({ type: "USER_LOGIN_SUCCESS", payload: data.user });
      return { success: true, message: "Login successful" };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: "USER_LOGIN_FAIL", payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // get user details

  const userDetails=async()=>{
    try {
      dispatch({type:"USER_DETAILS_REQUEST"}
      )
      const {data}=await axios.get(`${API}/me`,{
        withCredentials:true
      })
      dispatch({type:"USER_DETAILS_SUCCESS",payload:data.user})
    } catch (error) {
      const errorMessage=error.response?.data?.message
      dispatch({type:"USER_DETAILS_FAIL",payload:errorMessage})
      return {success:false,message:errorMessage}
    }
  }

  // update user profile

  const updateUserProfile=async(updatedData)=>{
    try {
      dispatch({type:"USER_PROFILE_UPDATE_REQUEST"})
      const {data}=await axios.put(`${API}/update/profile`,updatedData,{
        withCredentials:true,
        headers:{
          'Content-Type':"multipart/form-data"
        }
      })
      dispatch({type:"USER_PROFILE_UPDATE_SUCCESS",payload:data.success})
    } catch (error) {
      const errorMessage=error.response?.data?.message
      dispatch({type:"USER_PROFILE_UPDATE_FAIL",payload:errorMessage})
    }
  }

  // logout 

  const logoutUser=async()=>{
    try {
      await axios.get(`${API}/logout`,{
        withCredentials:true
      })
      dispatch({type:"USER_LOGOUT_SUCCESS"})
    } catch (error) {
      const errorMessage=error.response?.data?.message
      dispatch({type:"USER_LOGOUT_FAIL",payload:errorMessage})
    }
  }

  // get all users -- access by an admin

  const getAllAdminUsers=async()=>{
    try {
      dispatch({type:"GET_ALL_ADMIN_USERS_REQUEST"})
      const {data}=await axios.get(`${API}/admin/getallusers`,{
        withCredentials:true,
      })
      dispatch({type:"GET_ALL_ADMIN_USERS_SUCCESS",payload:data})
    } catch (error) {
      dispatch({type:"GET_ALL_ADMIN_USERS_FAIL",payload:error.response?.data?.message})
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, register, login, dispatch,userDetails,updateUserProfile,logoutUser,getAllAdminUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
const useAuthContext = () => {
  return useContext(AuthContext);
};

export { useAuthContext, AuthContext, AuthProvider };
