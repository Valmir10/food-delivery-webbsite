const ordersRepository = require("../repositories/ordersRepository");
const cartRepository = require("../repositories/cartRepository");

const createOrderFromCart = async (userId) => {
  // 1. Get User cart
  const cartItems = await cartRepository.getCartByUserId(userId);
  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  // 2. Count total Price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 3.  Create order
  const expiresAt = new Date(Date.now() + 10_000).toISOString();

  const orderId = await ordersRepository.createOrder(
    userId,
    totalPrice,
    expiresAt,
  );

  // 4. Move cart_items → order_items
  for (const item of cartItems) {
    await ordersRepository.addOrderItem(
      orderId,
      item.productId,
      item.quantity,
      item.price,
    );
  }

  // Delete cart items
  for (const item of cartItems) {
    await cartRepository.deleteCartItem(item.id);
  }

  return orderId;
};

// Get all orders for one user
const getOrders = async (userId) => {
  const orders = await ordersRepository.getOrdersByUserId(userId);
  const now = new Date();

  for (const order of orders) {
    order.items = await ordersRepository.getOrderItemsByOrderId(order.id);

    if (new Date(order.expires_at) <= now) {
      order.status = "completed";
    } else {
      order.status = "active";
    }
  }

  return orders;
};

const setOrderStatus = async (orderId, status) => {
  await ordersRepository.updateOrderStatus(orderId, status);
};

module.exports = {
  createOrderFromCart,
  getOrders,
};
