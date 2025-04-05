//cart.js

//cart.js

const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Använder User-modellen
// const { verifyToken } = require("../server.js");
const verifyToken = require("../models/auth");

// 🔹 Hämta användarens varukorg
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart." });
  }
});

// 🔹 Uppdatera varukorgen
router.put("/", verifyToken, async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findById(req.user.id);
    const mergedCart = [...user.cart];

    cart.forEach((item) => {
      const existingItem = mergedCart.find(
        (prod) => prod.productId.toString() === item._id
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        mergedCart.push({ productId: item._id, quantity: item.quantity });
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

// 🔹 Rensa varukorgen (t.ex. efter en beställning)
router.delete("/", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart." });
  }
});

module.exports = router;
