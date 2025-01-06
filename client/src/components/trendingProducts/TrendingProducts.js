import { Rating } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import "./TrendingProducts.css";

const TrendingProducts = ({ course }) => {
  const { name, description, courseFees, noOfReviews, images, _id, ratings } =
    course;
  const options = {
    value: ratings,
    readOnly: true,
  };

  return (
    <>
      {course ? (
        <NavLink className="courseCard" to={`/course/${_id}`}>
          <img src={images[0].url} alt={name} />
          <h4>{name}</h4>
          <hr />
          <p>{description}</p>
          <div>
            <Rating className="courseCardRating" {...options} />
            <span> ({noOfReviews} Reviews)</span>
          </div>
          <span>{`₹${courseFees}`}</span>
        </NavLink>
      ) : (
        <h1>No any Courses found !</h1>
      )}
    </>
  );
};

export default TrendingProducts;
