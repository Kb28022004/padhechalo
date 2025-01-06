const Order = require("../models/orderModel");
const Course = require("../models/courseModel");

const updateStock = async (courseId, quantity) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("course not found");
  }

  if (course.stock < quantity) {
    throw new Error(`Insufficient stock for course: ${course.name}`);
  }

  course.stock -= quantity;

  await course.save({ validateBeforeSave: false });
};

// create a new order
const createNewOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Update stock for each ordered item
    for (const item of orderItems) {
      await updateStock(item.product, item.quantity);
    }

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({ success: true, message: "Order placed", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to create a new order due to some technical error",
    });
  }
};

// update order status -- admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(200).json({
        success: false,
        message: "You have already delivered this order",
      });
    }

    // Update order status and handle delivery
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to update order status due to a technical error",
    });
  }
};

// get single order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found with this id" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to get single order due to some technical error",
    });
  }
};

// get all logged user's orders
const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "user",
      "name email"
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      nbHits: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch orders due to a technical error. Please try again later.",
    });
  }
};

// get all orders -- admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res
      .status(200)
      .json({ success: true, nbHits: orders.length, totalAmount, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to get orders due to some technical error",
    });
  }
};

// delete orders -- admin
const deleteOrders = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order with this id is not found" });
    }
    res.status(200).json({ success: true, message: "Order has been deleted" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNewOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrders,
};
