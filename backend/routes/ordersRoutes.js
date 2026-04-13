const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const requireAuth = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", ordersController.getOrders);

router.post("/", ordersController.checkout);

module.exports = router;
