const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const requireAuth = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/", cartController.updateCart);
router.delete("/", cartController.removeFromCart);

module.exports = router;
