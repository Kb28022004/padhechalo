const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide course name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide course description"],
  },
  courseFees: {
    type: Number,
    required: [true, "Please provide course fees"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  noOfReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
