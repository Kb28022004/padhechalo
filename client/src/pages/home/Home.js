import React, { useEffect } from "react";
import MetaData from "../../utils/MetaData";
import { Link, NavLink } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import MouseIcon from "@mui/icons-material/Mouse";
import "./Home.css";
import { useCourseContext } from "../../context/courseContext";
import TrendingProducts from "../../components/trendingProducts/TrendingProducts";
import Loader from '../../components/helper/loader/Loader'


const Home = () => {
  const { loading, trendingCourses, getTrendingCourses } = useCourseContext();

  useEffect(() => {
    getTrendingCourses();
  }, []);
  return (
    <>
      <MetaData title="Padhe Chalo- Home " />
      <Box className="banner">
        <Typography variant="body1" >Welcome to PadhneChalo Family </Typography>
        <Typography variant="h1">FIND AMAZING COURSES TO GROW UP BELOW</Typography>
        <NavLink to="#container">
          <Button variant="text">
            Scroll <MouseIcon />
          </Button>
        </NavLink>
      </Box>
      <h2 className="homeHeading">Trending Courses</h2>
      {loading ? (
        <Loader />
      ) : (
        <Box className="Homecontainer" id="container">
          {trendingCourses
            ? trendingCourses.map((course) => (
                <TrendingProducts course={course} />
              ))
            : "There is no any course"}
        </Box>
      )}
    </>
  );
};

export default Home;
