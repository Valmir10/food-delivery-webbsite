const ordersRepository = require("../repositories/ordersRepository");
const cartRepository = require("../repositories/cartRepository");

const createOrderFromCart = async (userId) => {
  const cartItems = await cartRepository.getCartByUserId(userId);
  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const orderId = await ordersRepository.createOrder(userId, totalPrice);

  for (const item of cartItems) {
    await ordersRepository.addOrderItem(
      orderId,
      item.productId,
      item.quantity,
      item.price,
    );
  }

  for (const item of cartItems) {
    await cartRepository.deleteCartItem(item.id);
  }

  return orderId;
};

const getOrders = async (userId) => {
  const orders = await ordersRepository.getOrdersByUserId(userId);

  for (const order of orders) {
    order.items = await ordersRepository.getOrderItemsByOrderId(order.id);
  }

  return orders;
};

module.exports = {
  createOrderFromCart,
  getOrders,
};