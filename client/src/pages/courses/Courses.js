import React, { useEffect, useState } from "react";
import { useCourseContext } from "../../context/courseContext";
import Loader from "../../components/helper/loader/Loader";
import MetaData from "../../utils/MetaData";
import TrendingProducts from "../../components/trendingProducts/TrendingProducts";
import "./Courses.css";
import { Link, NavLink, useParams } from "react-router-dom";
import { Button, Pagination, Slider, Typography } from "@mui/material";
import toast from "react-hot-toast";

const Courses = () => {
  const { loading, courses, error, courseCounts, resultPerPage, dispatch, getAllCourses } = useCourseContext();
  const [courseFees, setCourseFees] = useState([0, 50000]);
  const [category, setcategory] = useState("");
  const [ratings, setratings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

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

  const priceHandler = (e, newPrice) => {
    setCourseFees(newPrice);
  };

  const ratingHandler = (e, newRating) => {
    setratings(newRating);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page state
    getAllCourses(keyword || "", courseFees, category, ratings, value);
  };

  const clearFilters = () => {
    setCourseFees([0, 50000]); // Reset course fees
    setcategory("");          // Reset category
    setratings(0);            // Reset ratings
    setCurrentPage(1);        // Reset to the first page
    toast.success("Filters cleared successfully!");
  };

  const { keyword } = useParams();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "CLEAR_ERRORS" });
    }

    getAllCourses(keyword || "", courseFees, category, ratings, currentPage);
  }, [keyword, courseFees, category, ratings, currentPage]); // Include currentPage in the dependency array

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Courses" />
          <h2 className="coursesHeading">Courses</h2>

          {/* Courses List */}
          <div className="courses">
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <TrendingProducts key={course._id} course={course} />
              ))
            ) : (
              <h2 className="noCoursesMessage">
                No Courses found with the selected filters.
              </h2>
            )}
          </div>

          {/* Filters */}
          <div className="filterBox">
            <Typography variant="h5">Price</Typography>
            <Slider
              aria-labelledby="range-slider"
              valueLabelDisplay="auto"
              onChange={priceHandler}
              min={0}
              max={50000}
              value={courseFees}
            />

            <Typography variant="h5">Category</Typography>
            <ul className="categoryBox">
              {categories.map((categoryItem) => (
                <li
                  className={`category-link ${
                    category === categoryItem ? "active" : ""
                  }`}
                  key={categoryItem}
                  onClick={() => setcategory(categoryItem)}
                >
                  {categoryItem}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography variant="body1" component="legend">
                Ratings
              </Typography>
              <Slider
                valueLabelDisplay="auto"
                min={0}
                max={5}
                aria-labelledby="continuous-slider"
                value={ratings}
                onChange={ratingHandler}
              />
            </fieldset>

            {/* Clear Filters Button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={clearFilters}
              style={{ marginTop: "20px" }}
            >
              Clear All Filters
            </Button>
          </div>

          {/* Pagination */}
          {resultPerPage < courseCounts && (
            <div className="paginationBox">
              <Pagination
                count={Math.ceil(courseCounts / resultPerPage)}
                page={currentPage} // Set the current page
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Courses;
