const Course = require("../models/courseModel");
const ApiFeature = require("../utils/apiFeatures");
const dotenv =require('dotenv')
dotenv.config()

// create course -- admin

const createCourse = async (req, res) => {
  try {
    const { name, description, courseFees,stock, category} = req.body;
    const images = req.files.map((file) => ({
      public_id: file.filename,
      url: `${process.env.API_BASE_URL}/uploads/${file.filename}`, // Adjust as per your static file path
    }));
    const courseName = await Course.findOne({ name });
    if (courseName) {
      return res
        .status(404)
        .json({ message: "Select another name and title", success: false });
    }

    if (!name || !description || !courseFees || !category) {
      return res.status(400).json({
        success: false,
        message: "Kindly filled the required credentials",
      });
    }

    const course = await Course.create({
      name,
      description,
      courseFees,
      category,
      images,
      stock,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "A new course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create a course due to some internal server errors",
    });
  }
};

// get all courses

const getAllCourses = async (req, res) => {
  try {
    const resultPerPage = 3;
    const courseCounts = await Course.countDocuments();
    const apiFeatures = new ApiFeature(Course.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const courses = await apiFeatures.query;

    res
      .status(200)
      .json({
        nbCourses: courses.length,
        success: true,
        courseCounts,
        courses,
        resultPerPage,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Unable to get all the courses due to internal server error",
      });
  }
};

// get a single course

const getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Unable to get all the courses due to internal server error",
      });
  }
};

// update course -- access by an admin

const updateCourse = async (req, res) => {
  try {
    const { name, description, courseFees, stock, category } = req.body;
    const { id } = req.params;

    // Find the existing course
    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Prepare updated fields
    const updatedCourseDetails = {
      ...(name && { name }),
      ...(description && { description }),
      ...(courseFees && { courseFees }),
      ...(stock && { stock }),
      ...(category && { category }),
    };

    // Handle images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        public_id: file.filename,
        url: `${process.env.API_BASE_URL}/uploads/${file.filename}`, // Adjust as per your static file path
      }));

      // Combine existing and new images
      updatedCourseDetails.images = [...course.images, ...newImages];
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updatedCourseDetails },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Course has been updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to update course due to internal server error",
    });
  }
};

// delete course -- access by an admin

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (course) {
      return res
        .status(404)
        .json({ success: false, message: "course not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Course has been deleted succesfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Unable to get all the courses due to internal server error",
      });
  }
};

// get all courses -- admin

const getAdminAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "courses are not found" });
    }
    res.status(200).json({success:true,courses})
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Unable to get all the courses due to internal server error",
      });
  }
};

// create and update the review

const createAndUpdateReview = async (req, res) => {
  try {
    const { courseId, comment, rating } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const isReviewed = course.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      course.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
        
      });
    } else {
      course.reviews.push(review);
      course.noOfReviews = course.reviews.length;
    }

    let avg = 0;

    course.ratings = course.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    course.ratings = avg / course.reviews.length;

    await course.save({ validateBeforeSave: false });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};

// get all reviews

const getAllReviews=async(req,res)=>{
    try {
        const course=await Course.find(req.query.id)
        if(!course){
            return res
        .status(404)
        .json({ success: false, message: "Course not found" });
        }

        res.status(200).json({
            success: true,
            nbHits: course.reviews.length,
            reviews: course.reviews,
          });
    } catch (error) {
        
console.log(error);
res.status(500).json({ success: false, message: "Internal server Error" });
    }
}



module.exports = {
  createCourse,
  getAllCourses,
  getCourseDetail,
  updateCourse,
  deleteCourse,
  getAdminAllCourses,
  createAndUpdateReview,
  getAllReviews
};
