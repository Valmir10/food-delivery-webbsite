import React, { useEffect, useState } from "react";
import "../styles/Menu.css";

import deleteIcon from "../images/cancel.png";
import StarsFour from "../images/Stars-rating-4.0.png";
import StarsFive from "../images/Stars-rating-5.0.png";
import StarsFourHalf from "../images/Stars-rating-4.5.png";

import Alert from "./Alert.jsx";
import { useAlert } from "../hooks/useAlert";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";

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
  const { showAlert, visible, alertProps } = useAlert(); // hooken

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

  useEffect(() => {
    console.log("MENU isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  const getCartItem = (productId) =>
    cart.find((item) => item.productId === productId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
        {filteredProducts.length > 0 ? (
          Object.keys(
            filteredProducts.reduce((acc, product) => {
              if (!acc[product.category]) acc[product.category] = [];
              acc[product.category].push(product);
              return acc;
            }, {}),
          ).map((category) => (
            <div
              key={category}
              className={`${category.toLowerCase().replace(/ /g, "-")}-menu-container`}
            >
              {filteredProducts
                .filter((p) => p.category === category)
                .map((product) => {
                  const cartItem = getCartItem(product.id);

                  return (
                    <div
                      key={product.id}
                      className={`menu-${category
                        .toLowerCase()
                        .replace(/ /g, "-")}-img-container`}
                    >
                      <img
                        src={`http://localhost:3001${product.image_url}`}
                        alt={product.name}
                        onError={(e) => {
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
                          {!cartItem ? (
                            <div
                              className="add-quantity-container"
                              onClick={() => {
                                if (!isLoggedIn) {
                                  showAlert("Please sign in to order products");
                                  return;
                                }
                                add(product.id);
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
                  );
                })}
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

/*

// Menu.jsx


import React, { useEffect, useState } from "react";
import "../styles/Menu.css";


import deleteIcon from "../images/cancel.png";
import StarsFour from "../images/Stars-rating-4.0.png";
import StarsFive from "../images/Stars-rating-5.0.png";
import StarsFourHalf from "../images/Stars-rating-4.5.png";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
const { isLoggedIn } = useAuth();
const { cart, add, update } = useCart(isLoggedIn);


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


  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
   if (!selectedCategory) {
     setFilteredProducts(products);
   } else {
     const filtered = products.filter(
       (product) =>
         product.category.toLowerCase() === selectedCategory.toLowerCase(),
     );
     setFilteredProducts(filtered);
   }
 }, [products, selectedCategory]);


 if (loading) return <p>Loading...</p>;
 if (error) return <p>{error}</p>;


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
           }, {}),
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
                   key={product.id}
                   className={`menu-${category
                     .toLowerCase()
                     .replace(/ /g, "-")}-img-container`}
                 >
                   <img
                     src={`http://localhost:3001${product.image_url}`}
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
                       <div className="add-quantity-container disabled">
                         <p>+</p>
                       </div>
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
};;


export default Menu;

*/
