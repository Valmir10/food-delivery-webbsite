//server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Orders");
const categoriesRoute = require("./routes/categories");
const cartRoute = require("./routes/cart");

const app = express();

const PORT = process.env.PORT || 5001;

const SECRET_KEY = process.env.SECRET_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

// CORS-Settings
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));
const uri = process.env.MONGODB_URI;
console.log("🔍 [DEBUG] MONGODB_URI är:", JSON.stringify(uri));
mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔹 Generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
};

// 🔹 Middleware for JWT-token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied - Missing Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Register User
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email.includes("@"))
      return res.status(400).json({ message: "Invalid email format." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ name, email, password, cart: [] });
    await newUser.save();

    //Genrate token after registration
    const token = generateToken(newUser);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Get user profile
app.get("/api/user-profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

// Get products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get orders made by Users
app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: "products.productId",
        select: "name price category imageUrl",
      })
      .sort({ createdAt: -1 });

    const activeOrder = orders.find((order) => order.orderStatus === "active");
    const completedOrders = orders.filter(
      (order) => order.orderStatus === "completed"
    );

    res.status(200).json({ activeOrder, completedOrders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// Create new order
app.post("/api/orders", verifyToken, async (req, res) => {
  const { products, totalPrice } = req.body;
  try {
    // Hämta användarens aktiva beställning
    const activeOrder = await Order.findOne({
      userId: req.user.id,
      orderStatus: "active",
    });

    if (activeOrder) {
      await Order.findByIdAndUpdate(activeOrder._id, {
        orderStatus: "completed",
      });
    }

    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalPrice,
      orderStatus: "active",
      startTime: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newOrder.save();

    // Delete cart after order
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    const previousOrders = await Order.find({
      userId: req.user.id,
      orderStatus: "completed",
    }).sort({ createdAt: -1 });
    res
      .status(201)
      .json({ message: "Order placed successfully", newOrder, previousOrders });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order." });
  }
});

// Update order to completed
app.put("/api/orders/:orderId", verifyToken, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, userId: req.user.id },
      { orderStatus: "completed" },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order." });
  }
});

// Delete orders
app.delete("/api/orders", verifyToken, async (req, res) => {
  try {
    await Order.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete orders." });
  }
});

app.use("/api/categories", categoriesRoute);

//  cart-router
app.use("/api/cart", cartRoute);

module.exports = { verifyToken };

// Start server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

/*

//server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Orders");
const categoriesRoute = require("./routes/categories");
const cartRoute = require("./routes/cart");

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = "your_secret_key";

// CORS-Settings
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/food-delivery-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.log("❌ Failed to connect to MongoDB", error));

// 🔹 Generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
};

// 🔹 Middleware for JWT-token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied - Missing Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Register User
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email.includes("@"))
      return res.status(400).json({ message: "Invalid email format." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ name, email, password, cart: [] });
    await newUser.save();

    //Genrate token after registration
    const token = generateToken(newUser);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Get user profile
app.get("/api/user-profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

// Get products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get orders made by Users
app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: "products.productId",
        select: "name price category imageUrl",
      })
      .sort({ createdAt: -1 });

    const activeOrder = orders.find((order) => order.orderStatus === "active");
    const completedOrders = orders.filter(
      (order) => order.orderStatus === "completed"
    );

    res.status(200).json({ activeOrder, completedOrders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// Create new order
app.post("/api/orders", verifyToken, async (req, res) => {
  const { products, totalPrice } = req.body;
  try {
    // Hämta användarens aktiva beställning
    const activeOrder = await Order.findOne({
      userId: req.user.id,
      orderStatus: "active",
    });

    if (activeOrder) {
      await Order.findByIdAndUpdate(activeOrder._id, {
        orderStatus: "completed",
      });
    }

    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalPrice,
      orderStatus: "active",
      startTime: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newOrder.save();

    // Delete cart after order
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    const previousOrders = await Order.find({
      userId: req.user.id,
      orderStatus: "completed",
    }).sort({ createdAt: -1 });
    res
      .status(201)
      .json({ message: "Order placed successfully", newOrder, previousOrders });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order." });
  }
});

// Update order to completed
app.put("/api/orders/:orderId", verifyToken, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, userId: req.user.id },
      { orderStatus: "completed" },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order." });
  }
});

// Delete orders
app.delete("/api/orders", verifyToken, async (req, res) => {
  try {
    await Order.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete orders." });
  }
});

app.use("/api/categories", categoriesRoute);

//  cart-router
app.use("/api/cart", cartRoute);

module.exports = { verifyToken };

// Start server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});



*/
