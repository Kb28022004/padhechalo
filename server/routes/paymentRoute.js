
const express=require('express')
const {processPayment, sendStripeApiKey} = require('../controllers/paymentController')
const {isAuthencated} = require('../middleware/auth')

const router=express.Router()

router.route('/process/payment').post(isAuthencated,processPayment)
router.route('/stripeapikey').get(isAuthencated,sendStripeApiKey)


module.exports=router;