// Menu.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Menu.css";
import { useOrder } from "./OrderContent";
import { useAuth } from "../hooks/useAuth.js";
import { API_BASE } from "../api.js";

import deleteIcon from "../images/cancel.png";
import StarsFour from "../images/Stars-rating-4.0.png";
import StarsFive from "../images/Stars-rating-5.0.png";
import StarsFourHalf from "../images/Stars-rating-4.5.png";

const imageModules = import.meta.glob("../images/*", {
  eager: true,
  import: "default",
});
const productImageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => {
    const filename = path.split("/").pop();
    return [filename, url];
  })
);

const Menu = ({ selectedCategory, resetCategory, isFilterActive }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { state, dispatch, updateCart } = useOrder();

  const { isLoggedIn, handleLogout } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/products`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch({ type: "UPDATE_QUANTITY", payload: state.quantities });
    }
  }, [isLoggedIn, dispatch, state.quantities]);

  const handleAddQuantity = async (id) => {
    const product = products.find((p) => p._id === id);
    if (!product) {
      console.error("Product not found:", id);
      return;
    }

    const existingQty = state.quantities[id] || 0;
    const newQty = existingQty + 1;

    dispatch({
      type: "ADD_TO_ORDER",
      payload: { ...product, quantity: newQty },
    });
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { _id: id, quantity: newQty },
    });

    const updatedQuantities = { ...state.quantities, [id]: newQty };
    const rawCart = Object.entries(updatedQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([prodId, qty]) => ({ productId: prodId, quantity: qty }));

    if (isLoggedIn) {
      try {
        await updateCart(rawCart);
      } catch (error) {
        console.error("Failed to sync cart via updateCart:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(rawCart));
    }
  };

  // Delete product from cart and update Context
  const handleRemoveQuantity = (id) => {
    const newQuantity = Math.max((state.quantities[id] || 0) - 1, 0);

    if (newQuantity > 0) {
      dispatch({
        type: "ADD_TO_ORDER",
        payload: {
          ...products.find((product) => product._id === id),
          quantity: newQuantity,
        },
      });
    } else {
      dispatch({ type: "REMOVE_FROM_ORDER", payload: id });
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { _id: id, quantity: newQuantity },
    });
  };

  return (
    <div className="menu-section-container">
      <div className="menu-container-text">
        <p>Menu</p>
      </div>

      {isFilterActive && (
        <div className="delete-icon-container-menu" onClick={resetCategory}>
          <img src={deleteIcon} alt="Delete filter" />
          <div className="delete-filter-tooltip">Close Filter</div>
        </div>
      )}

      <div className="menu-products-container">
        {filteredProducts.length > 0 ? (
          Object.keys(
            filteredProducts.reduce((acc, product) => {
              if (!acc[product.category]) {
                acc[product.category] = [];
              }
              acc[product.category].push(product);
              return acc;
            }, {})
          ).map((category) => (
            <div
              key={category}
              className={`${category
                .toLowerCase()
                .replace(/ /g, "-")}-menu-container`}
            >
              {filteredProducts
                .filter((product) => product.category === category)
                .map((product) => (
                  <div
                    key={product._id}
                    className={`menu-${category
                      .toLowerCase()
                      .replace(/ /g, "-")}-img-container`}
                  >
                    <img
                      src={
                        productImageMap[
                          product.imageUrl.replace(/^\/images\//, "")
                        ] || productImageMap["default-product.png"]
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = productImageMap["default-product.png"];
                      }}
                    />
                    <div className="name-stars-container">
                      <div className="product-name">
                        <p>{product.name}</p>
                      </div>
                      <div className="stars">
                        <img
                          src={
                            product.rating >= 4.5
                              ? StarsFive
                              : product.rating >= 4
                              ? StarsFourHalf
                              : StarsFour
                          }
                          alt="rating"
                        />
                      </div>
                    </div>
                    <div className="product-text">
                      <p>{product.description}</p>
                    </div>
                    <div className="price-add-container">
                      <div className="price-container">
                        <p className="price-p">${product.price}</p>
                      </div>
                      <div className="add-container">
                        {state.quantities[product._id] > 0 ? (
                          <>
                            <div
                              className="add-minus-container"
                              onClick={() => handleRemoveQuantity(product._id)}
                            >
                              <p>-</p>
                            </div>
                            <div className="quantity-container">
                              <p>{state.quantities[product._id]}</p>
                            </div>
                            <div
                              className="add-quantity-container active"
                              onClick={() => handleAddQuantity(product._id)}
                            >
                              <p>+</p>
                            </div>
                          </>
                        ) : (
                          <div
                            className="add-quantity-container"
                            onClick={() => handleAddQuantity(product._id)}
                          >
                            <p>+</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
