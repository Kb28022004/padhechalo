import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "../reducer/courseReducer";
import axios from "axios";

const CourseContext = createContext();

const API = "http://localhost:8000/api/v1/course";

const initialState = {
  loading: false,
  error: null,
  courses: [],
  course: {},
  trendingCourses: [],
  courseCounts: 0,
  resultPerPage: 0,
  currentPage: 1, // Added this,
  isDeleted: false,
  isUpdated: false,
};

const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // get trending courses

  const getTrendingCourses = async () => {
    try {
      dispatch({ type: "TRENDING_COURSES_REQUEST" });
      const { data } = await axios.get(`${API}/getallcourses`, {
        withCredentials: true,
      });
      dispatch({ type: "TRENDING_COURSES_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "TRENDING_COURSES_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // get all courses

  const getAllCourses = async (
    keyword = "",
    courseFees = [0, 50000],
    category = "",
    ratings = 0,
    page = 1
  ) => {
    try {
      dispatch({ type: "ALL_COURSES_REQUEST" });

      const query = new URLSearchParams({
        keyword,

        "courseFees[gte]": courseFees[0],
        "courseFees[lte]": courseFees[1],
        ...(category && { category }),
        "ratings[gte]": ratings,
        page,
      }).toString();
      const { data } = await axios.get(`${API}/getallcourses?${query}`, {
        withCredentials: true,
      });
      dispatch({ type: "ALL_COURSES_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "ALL_COURSES_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // get single course details

  const getCourseDetails = async (id) => {
    try {
      dispatch({ type: "COURSE_DETAILS_REQUEST" });
      const { data } = await axios.get(`${API}/getsinglecourse/${id}`, {
        withCredentials: true,
      });
      dispatch({ type: "COURSE_DETAILS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "COURSE_DETAILS_FAIL",
        payload: error.response?.data?.message,
      });
    }
  };

  // get admin all courses

  const getAdminCourses = async () => {
    try {
      dispatch({ type: "ALL_ADMIN_COURSES_REQUEST" });
      const { data } = await axios.get(`${API}/admin/allcourses`, {
        withCredentials: true,
      });
      dispatch({ type: "ALL_ADMIN_COURSES_SUCCESS", payload: data.courses });
    } catch (error) {
      console.log(
        "Error fetching admin courses:",
        error.response?.data || error
      );
      dispatch({
        type: "ALL_ADMIN_COURSES_FAIL",
        payload:
          error.response?.data?.message || "Failed to fetch admin courses",
      });
    }
  };

  // delete courses by an admin

  const deleteCourses = async (id) => {
    try {
      dispatch({ type: "DELETE_COURSES_REQUEST" });
      const { data } = await axios.delete(`${API}/admin/delete/${id}`, {
        withCredentials: true,
      });
      dispatch({ type: "DELETE_COURSES_SUCCESS", payload: data.success });
    } catch (error) {
      dispatch({
        type: "DELETE_COURSES_FAIL",
        payload: error.response?.data?.message || "Failed to delete  courses",
      });
    }
  };

  // create a new course by an admin

  const addNewCourse = async (addedData) => {
    try {
      dispatch({ type: "ADD_NEW_COURSE_REQUEST" });
      const { data } = await axios.post(`${API}/admin/create`, addedData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({ type: "ADD_NEW_COURSE_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "ADD_NEW_COURSE_FAIL",
        payload:
          error.response?.data?.message || "Failed to add  a new   courses",
      });
    }
  };

  const updateCourse = async (id, updatedData) => {
    try {
      dispatch({ type: "UPDATE_COURSE_REQUEST" });
      const { data } = await axios.put(
        `${API}/admin/update/${id}`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "mulitipart/form-data",
          },
        }
      );
      dispatch({ type: "UPDATE_COURSE_SUCCESS", payload: data.success });
    } catch (error) {
      dispatch({
        type: "UPDATE_COURSE_FAIL",
        payload:
          error.response?.data?.message || "Failed to update a new courses",
      });
    }
  };

  // add new review

  const addAndUpdateNewReview = async (updatedReviewData) => {
    try {
      dispatch({ type: "ADD_NEW_REVIEW_REQUEST" });
      const { data } = await axios.put(`${API}/review`, updatedReviewData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      dispatch({ type: "ADD_NEW_REVIEW_SUCCESS", payload: data.success });
    } catch (error) {
      dispatch({
        type: "ADD_NEW_REVIEW_FAIL",
        payload:
          error.response?.data?.message || "Failed to add and update a new new",
      });
    }
  };

  return (
    <CourseContext.Provider
      value={{
        ...state,
        getTrendingCourses,
        getAllCourses,
        dispatch,
        getCourseDetails,
        getAdminCourses,
        deleteCourses,
        addNewCourse,
        updateCourse,
        addAndUpdateNewReview,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// custom hook

const useCourseContext = () => {
  return useContext(CourseContext);
};

export { useCourseContext, CourseProvider, CourseContext };
