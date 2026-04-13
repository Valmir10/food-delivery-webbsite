const cartService = require("../services/cartService");
const ordersService = require("../services/ordersService");
const productsService = require("../services/productsService");

describe("productsService", () => {
  test("getProducts returns an array", async () => {
    const products = await productsService.getProducts();
    expect(Array.isArray(products)).toBe(true);
  });

  test("products have required fields", async () => {
    const products = await productsService.getProducts();
    if (products.length > 0) {
      const product = products[0];
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("image_url");
    }
  });
});

describe("cartService", () => {
  const testUserId = 99999;

  test("getCart returns empty array for non-existent user", async () => {
    const cart = await cartService.getCart(testUserId);
    expect(Array.isArray(cart)).toBe(true);
    expect(cart.length).toBe(0);
  });
});

describe("ordersService", () => {
  const testUserId = 99999;

  test("getOrders returns array for non-existent user", async () => {
    const orders = await ordersService.getOrders(testUserId);
    expect(Array.isArray(orders)).toBe(true);
  });

  test("createOrderFromCart throws for empty cart", async () => {
    await expect(ordersService.createOrderFromCart(testUserId)).rejects.toThrow(
      "Cart is empty",
    );
  });
});