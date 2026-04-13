const ordersService = require("../services/ordersService");

const checkout = async (req, res) => {
  try {
    const userId = req.user.userId;
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

const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
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
