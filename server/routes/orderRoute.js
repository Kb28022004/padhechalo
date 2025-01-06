

const express=require('express')
const { createNewOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrders } = require('../controllers/orderController')
const { isAuthencated, authorizedRole } = require('../middleware/auth')

const router=express.Router()

router.route('/create').post( isAuthencated, createNewOrder)
router.route('/getsingleorder/:id').get( isAuthencated, getSingleOrder)
router.route('/myorders').get( isAuthencated, myOrders)
router.route('/admin/allorders').get( isAuthencated, authorizedRole('admin'), getAllOrders)
router.route('/admin/update/:id').put( isAuthencated, authorizedRole('admin'), updateOrderStatus)
router.route('/admin/delete/:id').delete( isAuthencated, authorizedRole('admin'), deleteOrders)

module.exports=router