const db = require("../db/database");

// Create a new order
const createOrder = (userId, totalPrice, expiresAt) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO orders (user_id, total_price, status, expires_at)
      VALUES (?, ?, 'active', ?)
    `;

    db.run(sql, [userId, totalPrice, expiresAt], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};
// Add items in order_items
const addOrderItem = (orderId, productId, quantity, priceAtPurchase) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
      VALUES (?, ?, ?, ?)
    `;
    db.run(
      sql,
      [orderId, productId, quantity, priceAtPurchase],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

// Get all orders for user
const getOrdersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(sql, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get order_items for one order
const getOrderItemsByOrderId = (orderId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        oi.id,
        oi.quantity,
        oi.price_at_purchase,
        p.id AS productId,
        p.name,
        p.category,
        p.price,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    db.all(sql, [orderId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const updateOrderStatus = (orderId, status) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    db.run(sql, [status, orderId], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = {
  createOrder,
  addOrderItem,
  getOrdersByUserId,
  getOrderItemsByOrderId,
  updateOrderStatus,
};
