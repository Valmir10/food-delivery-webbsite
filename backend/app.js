require("dotenv").config();
const express = require("express");
const app = express();
const cartRoutes = require("./routes/cartRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

const productsRoutes = require("./routes/productsRoutes");
app.use("/products", productsRoutes);

app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

module.exports = app;
