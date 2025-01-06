import React, { useEffect, useState } from "react";
import { useCourseContext } from "../../../context/courseContext";
import { useParams } from "react-router-dom";
import MetaData from "../../../utils/MetaData";
import ProductImages from "../../helper/ProductImages";
import Loader from "../../helper/loader/Loader";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import ReviewCard from "../../helper/reviewCard/ReviewCard";
import "./CourseDetails.css";
import { useCartContext } from "../../../context/cartContext";

const CourseDetails = () => {
  const [open, setopen] = useState(false);
  const [rating, setrating] = useState(0);
  const [comment, setcomment] = useState("");
  const [quantity, setquantity] = useState(1);
  const {
    course,
    getCourseDetails,
    loading,
    error,
    dispatch,
    addAndUpdateNewReview,
  } = useCourseContext();
  const { addItemsToCart } = useCartContext();
  const {
    name,
    courseFees,
    stock,
    description,
    _id,
    images,
    ratings,
    noOfReviews,
    reviews = [], // Default to an empty array if no reviews
  } = course;

  const { id } = useParams();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "CLEAR_ERRORS" });
    }
    getCourseDetails(id);
  }, [id]);

  const options = {
    value: ratings || 0, // Fallback to 0
    readOnly: true,
    size: "large",
    precision: 0.5,
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setquantity(quantity - 1);
    }
  };
  const handleIncrease = () => {
    if (quantity > stock) {
      setquantity(quantity);
    } else {
      if (quantity < stock) {
        setquantity(quantity + 1);
      }
    }
  };

  const handleAddToCart = () => {
    addItemsToCart(id, quantity);
    toast.success("Your item has been added to the cart");
  };

  const handleOpen = () => {
    setopen(true);
  };

  const handleSubmitReview = async(e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.append("rating", rating);
    myForm.append("comment", comment);
    myForm.append("courseId", id);

   await  addAndUpdateNewReview(myForm);
    setopen(false)
    await getCourseDetails(id)
  };

  return (
    <>
      <MetaData title={`${course?.name} --- padheChalo`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="courseDetails">
          <div>
            <ProductImages images={images} />
          </div>
          <div>
            <div className="detailsBlock-1">
              <h2>{name}</h2>
              <p>Course # {_id}</p>
            </div>
            <div className="detailsBlock-2">
              <Rating {...options} />
              <span> ({noOfReviews} Reviews)</span>
            </div>
            <div className="detailsBlock-3">
              <h1>{`₹ ${courseFees}`}</h1>
              <div className="detailsBlock-3-1">
                <div className="detailsBlock-3-1-1">
                  <button onClick={handleDecrease}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={handleIncrease}>+</button>
                </div>
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>

              <p>
                Status:{" "}
                <b className={stock < 1 ? "redColor" : "greenColor"}>
                  {stock < 1 ? "Not Available" : "Available"}
                </b>
              </p>
            </div>
            <div className="detailsBlock-4">
              Description: <p>{description}</p>
            </div>
            <button onClick={handleOpen} className="submitReview">
              Submit Review
            </button>
          </div>
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="reviews">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="noReviews">No Reviews Yet</p>
      )}

      <Dialog
        aria-labelledby="simple-dialog-title"
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={() => setopen(false)}
      >
        <DialogTitle>Add Reviews</DialogTitle>
        <DialogContent className="submitDailog">
          <Rating
            value={rating}
            onChange={(e) => setrating(e.target.value)}
            size="large"
          />
          <TextField
            multiline
            value={comment}
            onChange={(e) => setcomment(e.target.value)}
            label="Your comment"
            variant="outlined"
            rows={2}
            style={{ marginTop: "12px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setopen(false)}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            sx={{width:"30%"}}
           
            disabled={loading}
            color="success"
          >
            {loading ? <CircularProgress/> :"Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseDetails;
