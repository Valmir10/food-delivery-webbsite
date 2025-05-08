//cart.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../models/auth");

// Get user cart
router.get("/", verifyToken, async (req, res) => {
  console.log("→ GET /api/cart, req.user.id =", req.user.id);
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    console.log("  Fetched cart:", user.cart);
    res.status(200).json(user.cart);
  } catch (error) {
    console.error("← ERROR in GET /api/cart:", error);
    res.status(500).json({ message: "Failed to fetch cart." });
  }
});

// Update cart
router.put("/", verifyToken, async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findById(req.user.id);
    const mergedCart = [...user.cart];

    cart.forEach((item) => {
      const existing = mergedCart.find(
        (prod) => prod.productId.toString() === item.productId
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        mergedCart.push({ productId: item.productId, quantity: item.quantity });
      }
    });

    user.cart = mergedCart;
    await user.save();
    res
      .status(200)
      .json({ message: "Cart updated successfully.", cart: mergedCart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart." });
  }
});

// Clear cart after order
router.delete("/", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart." });
  }
});

module.exports = router;
