const cartRepository = require("../repositories/cartRepository");

const getCart = async (userId) => {
  return await cartRepository.getCartByUserId(userId);
};

const addToCart = async (userId, productId, quantity) => {
  const existingItem = await cartRepository.getCartItem(userId, productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    await cartRepository.updateCartItem(existingItem.id, newQuantity);
  } else {
    await cartRepository.addCartItem(userId, productId, quantity);
  }
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
  const item = await cartRepository.getCartItem(userId, productId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  if (quantity <= 0) {
    await cartRepository.deleteCartItem(item.id);
  } else {
    await cartRepository.updateCartItem(item.id, quantity);
  }
};

const removeFromCart = async (userId, productId) => {
  const item = await cartRepository.getCartItem(userId, productId);

  if (item) {
    await cartRepository.deleteCartItem(item.id);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
};
