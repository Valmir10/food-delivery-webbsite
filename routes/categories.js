//routes/categories.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// POST: Add new category
router.post("/", async (req, res) => {
  console.log("POST request to /api/categories");
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  console.log("GET request to /api/categories");
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
