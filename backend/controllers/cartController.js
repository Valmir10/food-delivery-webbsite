const cartService = require("../services/cartService");

// GET /cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Failed to get cart" });
  }
};

// POST /cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    await cartService.addToCart(userId, productId, quantity);
    res.status(201).json({ message: "Product added to cart" });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// PUT /cart
const updateCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    await cartService.updateCartItemQuantity(userId, productId, quantity);
    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// DELETE /cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    await cartService.removeFromCart(userId, productId);
    res.json({ message: "Product removed from cart" });
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ message: "Failed to remove product" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
};
