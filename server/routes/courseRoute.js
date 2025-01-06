const express=require('express')
const { isAuthencated, authorizedRole } = require('../middleware/auth')
const upload = require('../middleware/multer')
const { createCourse, getAllCourses, updateCourse, getCourseDetail, getAdminAllCourses, createAndUpdateReview, getAllReviews, deleteCourse } = require('../controllers/courseController')
const router=express.Router()


router.route('/admin/create').post(isAuthencated,authorizedRole('admin'),upload.array('images'),createCourse)
router.route('/admin/update/:id').put(isAuthencated,authorizedRole('admin'),upload.array('images',5),updateCourse)
router.route('/admin/delete/:id').delete(isAuthencated,authorizedRole('admin'),deleteCourse)
router.route('/admin/allcourses').get(isAuthencated,authorizedRole('admin'),getAdminAllCourses)
router.route('/review').put(isAuthencated,createAndUpdateReview)
router.route('/getsinglecourse/:id').get(getCourseDetail)
router.route('getallreviews').get(getAllReviews)
router.route('/getallcourses').get(getAllCourses)


module.exports=router