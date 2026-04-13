import { useEffect, useState } from "react";
import "../styles/Menu.css";

import deleteIcon from "../images/cancel.png";
import StarsFour from "../images/Stars-rating-4.0.png";
import StarsFive from "../images/Stars-rating-5.0.png";
import StarsFourHalf from "../images/Stars-rating-4.5.png";

import Alert from "./Alert.jsx";
import CategorySlider from "./CategorySlider.jsx";
import { useAlert } from "../hooks/useAlert";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { API_BASE, USE_MOCK } from "../config/api";

const imageModules = import.meta.glob("../images/*", {
  eager: true,
  import: "default",
});

const productImageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => {
    const filename = path.split("/").pop();
    return [filename, url];
  }),
);

const Menu = ({ selectedCategory, resetCategory, isFilterActive }) => {
  const { products, loading, error } = useProducts();
  const { isLoggedIn } = useAuth();
  const { cart, add, update } = useCartContext();
  const { showAlert, visible, alertProps } = useAlert();

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
        ),
      );
    }
  }, [products, selectedCategory]);

  const getCartItem = (productId) =>
    cart.find((item) => item.productId === productId);

  const getImageSrc = (product) => {
    if (USE_MOCK) {
      return import.meta.env.BASE_URL + product.image_url.replace(/^\//, "");
    }
    return `${API_BASE}${product.image_url}`;
  };

  if (loading) return <p className="menu-loading">Loading menu...</p>;
  if (error) return <p className="menu-error">{error}</p>;

  const grouped = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="menu-section-container">
      {visible && <Alert key={alertProps.key} {...alertProps} />}

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
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([category, items]) => (
            <CategorySlider key={category} category={category}>
              {items.map((product) => {
                const cartItem = getCartItem(product.id);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-card-image">
                      <img
                        src={getImageSrc(product)}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = productImageMap["exclamation.png"] || "";
                        }}
                      />
                    </div>

                    <div className="product-card-info">
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
                          {!cartItem ? (
                            <div
                              className="add-quantity-container"
                              onClick={async () => {
                                if (!isLoggedIn) {
                                  showAlert("Please sign in to order products");
                                  return;
                                }
                                try {
                                  await add(product.id);
                                } catch (err) {
                                  showAlert(err.message || "Failed to add product");
                                }
                              }}
                            >
                              <p>+</p>
                            </div>
                          ) : (
                            <>
                              <div
                                className="add-minus-container"
                                onClick={() => {
                                  if (cartItem.quantity === 1) {
                                    update(product.id, 0);
                                  } else {
                                    update(product.id, cartItem.quantity - 1);
                                  }
                                }}
                              >
                                <p>-</p>
                              </div>
                              <div className="quantity-container">
                                <p>{cartItem.quantity}</p>
                              </div>
                              <div
                                className="add-quantity-container active"
                                onClick={() =>
                                  update(product.id, cartItem.quantity + 1)
                                }
                              >
                                <p>+</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CategorySlider>
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>
    </div>
  );
};

export default Menu;