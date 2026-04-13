const productsRepository = require("../repositories/productsRepository");

const getProducts = async () => {
  const products = await productsRepository.getAllProducts();
  return products;
};

module.exports = {
  getProducts,
};
