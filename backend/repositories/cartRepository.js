const db = require("../db/database");

// Get the cart for a user
const getCartByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        cart_items.id,
        cart_items.quantity,
        products.id AS productId,
        products.name,
        products.price,
        products.image_url
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = ?
    `;

    db.all(sql, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Found a specefic cart item and user + product
const getCartItem = (userId, productId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM cart_items
      WHERE user_id = ? AND product_id = ?
    `;

    db.get(sql, [userId, productId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Add new product in cart
const addCartItem = (userId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
    `;

    db.run(sql, [userId, productId, quantity], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

// Uppdate quantity
const updateCartItem = (id, quantity) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE cart_items
      SET quantity = ?
      WHERE id = ?
    `;

    db.run(sql, [quantity, id], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Delete product from cart
const deleteCartItem = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cart_items WHERE id = ?`;

    db.run(sql, [id], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = {
  getCartByUserId,
  getCartItem,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
