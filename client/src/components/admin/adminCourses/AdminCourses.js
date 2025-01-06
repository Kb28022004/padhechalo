import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import MetaData from "../../../utils/MetaData";
import { useCourseContext } from "../../../context/courseContext";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import "./AdminCourses.css";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../helper/loader/Loader";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminCourses = () => {
  const [open, setopen] = useState(false);
  const [input, setinput] = useState({
    name: "",
    description: "",
    courseFees: "",
    stock: "",
    category: "",
  });
  const [images, setimages] = useState([]);
  const { name, description, courseFees, stock, category } = input;

  const navigate = useNavigate();
  const {
    loading,
    error,
    error: deleteError,
    dispatch,
    isDeleted,
    courses,
    getAdminCourses,
    addNewCourse,
    deleteCourses,
  } = useCourseContext();

  const columns = [
    {
      field: "image",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.row.image}
          alt="course"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    { field: "id", headerName: "Course Id", minWidth: 100, flex: 0.5 },
    { field: "name", headerName: "Course Name", minWidth: 150, flex: 1 },
    {
      field: "courseFees",
      headerName: "Course Fees",
      minWidth: 100,
      flex: 0.5,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/course/${params.row.id}`}>
              <Tooltip title="Edit">
                <EditIcon style={{ color: "green" }} />
              </Tooltip>
            </Link>
            <Button style={{ marginBottom: "12px" }} color="error">
              <Tooltip title="Delete">
                <DeleteIcon
                  onClick={() => {
                    handleDelete(params.row.id);
                  }}
                />
              </Tooltip>
            </Button>
          </>
        );
      },
    },
  ];

  const rows = courses?.map((course) => ({
    id: course._id,
    image: `${course.images?.[0]?.url}` || "https://via.placeholder.com/50",

    name: course.name,
    courseFees: course.courseFees || "N/A",
  }));

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

  const handleClose = () => {
    setopen(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setimages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("courseFees", courseFees);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // Call the function to add the new course
      await addNewCourse(formData);

      // Fetch updated courses
      await getAdminCourses();

      // Reset the form and close the dialog
      setinput({
        name: "",
        description: "",
        stock: "",
        category: "",
        courseFees: "",
      });
      setimages([]);
      setopen(false);

      toast.success("A new course has been created successfully");
    } catch (error) {
      toast.error("Failed to create course. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch({ type: "CLEAR_ERRORS" });

    if (deleteError) {
      toast.error(deleteError);
    }
    dispatch({ type: "CLEAR_ERRORS" });

    if (isDeleted) {
      toast.success("Your course has been deleted successfully!");
      navigate("/admin/courses");
      dispatch({ type: "DELETE_COURSES_RESET" });
    }
    getAdminCourses();
  }, [error, isDeleted, dispatch]);

  const handleDelete = (id) => {
    deleteCourses(id);
  };

  return (
    <>
      <MetaData title="Courses" />
      <div className="dashboard">
        <Sidebar />
        {loading ? (
          <Loader />
        ) : (
          <Box className="courseContainer">
            <Box className="courseHeaderContent">
              <Typography className="courseTitle">Courses</Typography>
              <Button
                onClick={() => setopen(true)}
                variant="contained"
                className="addButton"
              >
                Add New Course
              </Button>
            </Box>
            <hr className="horiLine" />
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              className="adminStudentsTable"
              disableSelectionOnClick
            />
          </Box>
        )}
      </div>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h5">Add New Course</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={name}
            onChange={handleOnChange}
            label="Name"
            name="name"
            margin="dense"
            type="text"
            placeholder="Provide name of the course"
          />
          <TextField
            fullWidth
            name="description"
            onChange={handleOnChange}
            value={description}
            label="Description"
            margin="dense"
            type="text"
            placeholder="Provide description of the course"
          />
          <TextField
            fullWidth
            name="courseFees"
            onChange={handleOnChange}
            value={courseFees}
            label="Course Fees"
            margin="dense"
            type="number"
            placeholder="Provide fees of the course"
          />
          <FormControl fullWidth>
            <InputLabel id="select-label">Select Category</InputLabel>
            <Select
              value={category}
              name="category"
              onChange={handleOnChange}
              labelId="select-label"
              label="Select Option"
            >
              {categories &&
                categories.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            onChange={handleOnChange}
            value={stock}
            margin="dense"
            type="number"
            placeholder="Provide stock of the course"
          />
          <TextField
            fullWidth
            accept="image/*"
            onChange={handleFileChange}
            margin="dense"
            type="file"
            placeholder="Provide stock of the course"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminCourses;
