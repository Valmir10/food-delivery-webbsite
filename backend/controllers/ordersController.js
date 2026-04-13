const ordersService = require("../services/ordersService");

// POST /orders
const checkout = async (req, res) => {
  try {
    // VIKTIGT: Ändrat från req.user.id till req.user.userId
    // för att matcha payloaden i din authService.js
    const userId = req.user.userId;

    const orderId = await ordersService.createOrderFromCart(userId);

    res.status(201).json({
      message: "Order created",
      orderId,
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err.message);
    res.status(500).json({
      message: err.message || "Checkout failed",
    });
  }
};

// GET /orders
const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await ordersService.getOrders(userId);

    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err.message);
    res.status(500).json({
      message: err.message || "Failed to get orders",
    });
  }
};

module.exports = {
  checkout,
  getOrders,
};

/*
const ordersService = require("../services/ordersService");

// POST /orders

const checkout = async (req, res) => {
  try {
    // userId from JWT (authMiddleware)
    const userId = req.user.id;

    const orderId = await ordersService.createOrderFromCart(userId);

    res.status(201).json({
      message: "Order created",
      orderId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Checkout failed",
    });
  }
};

// GET /orders

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await ordersService.getOrders(userId);

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to get orders",
    });
  }
};

module.exports = {
  checkout,
  getOrders,
};


*/
