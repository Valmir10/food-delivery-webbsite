const productsService = require("../services/productsService");

const getProducts = async (req, res) => {
  try {
    const products = await productsService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

module.exports = {
  getProducts,
};
