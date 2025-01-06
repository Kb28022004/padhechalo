

const express=require('express')
const { registerUser, loginUser, logoutUser, getUserDetails, updateUserDetails, getAllUsers, updateUser, getSingleUser, delteUser } = require('../controllers/userController')
const { isAuthencated, authorizedRole } = require('../middleware/auth')
const upload = require('../middleware/multer')


const router=express.Router()

router.route('/register').post( upload.single('profilePicture'), registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/me').get(isAuthencated,getUserDetails)
router.route('/update/profile').put(isAuthencated,upload.single('profilePicture'),updateUserDetails)
router.route('/admin/getallusers').get(isAuthencated,authorizedRole('admin'),getAllUsers)
router.route('/admin/update/:id').put(isAuthencated,authorizedRole('admin'),updateUser)
router.route('/admin/getsingleruser/:id').get(isAuthencated,authorizedRole('admin'),getSingleUser)
router.route('/admin/delete/:id').delete(isAuthencated,authorizedRole('admin'),delteUser)



module.exports=router