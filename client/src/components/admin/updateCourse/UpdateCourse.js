import React, { useEffect, useState } from "react";
import MetaData from "../../../utils/MetaData";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "./UpdateCourse.css";
import Sidebar from "../sidebar/Sidebar";
import { useCourseContext } from "../../../context/courseContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../helper/loader/Loader";

const UpdateCourse = () => {
  const {
    course,
    getCourseDetails,
    dispatch,
    error,
    isUpdated,
    loading,
    updateCourse,
  } = useCourseContext();
  const [input, setinput] = useState({
    name: "",
    description: "",
    courseFees: "",
    stock: "",
    category: "",
  });
  const [images, setimages] = useState([]);

  const { name, description, courseFees, stock, category } = input;
  const { id } = useParams();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setimages([...e.target.files]);
  };
  const categories = [
    "Technology",
    "Sports",
    "Career Preparation",
    "Health & Wellness",
    "Personal Development",
    "Language Learning",
    "Arts & Humanities",
    "Hobbies and Special Interests",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("courseFees", courseFees);
  
    // Add new images or existing images if no new images are provided
    if (images.length > 0) {
      images.forEach((image) => formData.append("images", image));
    } else if (course.images) {
      course.images.forEach((image) => formData.append("existingImages", image));
    }
  
    await updateCourse(id, formData);
  };
  

  useEffect(() => {
    if (course && course._id !== id) {
      getCourseDetails(id);
    } else {
      setinput({
        name: course.name || "",
        description: course.description || "",
        stock: course.stock || "",
        category: course.category || "",
        courseFees: course.courseFees || "",
      });
    }

    if (error) {
      toast.error(error);
    }
    dispatch({ type: "CLEAR_ERRORS" });

    if (isUpdated) {
      toast.success("Your course has been updated successfully!");
      navigate("/admin/courses");
      dispatch({ type: "UPDATE_COURSE_RESET" });
    }
  }, [id, course, error, dispatch, isUpdated]);

  return (
    <>
      <MetaData title="Update Course" />
      <div className="dashboard">
        <Sidebar />
        {loading ? (
          <Loader />
        ) : (
          <div className="newCourseContainer">
            <form
              onSubmit={handleSubmit}
              className="createCourseForm"
              encType="multipart/form-data"
            >
              <Typography variant="h4">Update Course</Typography>
              <TextField
                type="text"
                value={name}
                fullWidth
                onChange={handleOnChange}
                margin="dense"
                label="Name"
                name="name"
              />
              <TextField
                type="text"
                fullWidth
                onChange={handleOnChange}
                value={description}
                margin="dense"
                label="Description"
                name="description"
              />
              <TextField
                type="number"
                fullWidth
                onChange={handleOnChange}
                margin="dense"
                value={courseFees}
                label="Course Fees"
                name="courseFees"
              />
              <TextField
                type="number"
                fullWidth
                onChange={handleOnChange}
                value={stock}
                margin="dense"
                label="Stock"
                name="stock"
              />
              <FormControl fullWidth>
                <InputLabel id="select-label">Select Category</InputLabel>
                <Select
                  fullWidth
                  onChange={handleOnChange}
                  value={category}
                  name="category"
                  labelId="select-label"
                  label="Select Option"
                >
                  {categories &&
                    categories.map((item) => {
                      return (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <TextField
                type="file"
                onChange={handleFileChange}
                fullWidth
                margin="dense"
                accept="image/*"
              />

              <Button disabled={loading} type="submit" variant="contained" fullWidth>
                {loading ? <CircularProgress/> :"Update"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateCourse;
