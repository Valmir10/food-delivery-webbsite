import React from "react";
import "./Filter.css";

import Pizzaimage from "../images/pizza-welcome.png";
import Pastaimage from "../images/product-pasta.png";
import AsianFoodImage from "../images/asian-food.png";
import MexicanFoodImage from "../images/mexican-food-welcome.png";
import BurgersImage from "../images/product-burgers.png";
import WrapsImage from "../images/product-wraps.png";
import VeganFoodImage from "../images/vegan-food.png";
import MediterraneanFoodImage from "../images/mediterranean-food.png";

const Filter = ({ onCategorySelect, selectedCategory }) => {
  if (typeof onCategorySelect !== "function") {
    console.error("onCategorySelect är inte en funktion:", onCategorySelect);
  }

  return (
    <div className="filter-section-container">
      <div className="explore-menu-p">Explore our menu</div>
      <div className="explore-menu-p-2">
        <p>
          Dive into our menu and discover a world of flavors crafted to delight.
          From comforting classics to exciting new tastes, <br></br> we’re here
          to turn every meal into a memorable experience.
        </p>
      </div>

      <div className="filter-product-container">
        <div
          className="product-container"
          onClick={() => onCategorySelect("Pizza")}
        >
          <div className="product-img-container">
            <img
              src={Pizzaimage}
              alt="Pizza"
              className={selectedCategory === "Pizza" ? "active" : ""}
            />
          </div>
          <div className="product-name-container">
            <p>Pizza</p>
          </div>
        </div>

        <div
          className="product-container"
          onClick={() => onCategorySelect("Pasta")}
        >
          <div className="product-img-container">
            <img
              src={Pastaimage}
              alt="Pasta"
              className={selectedCategory === "Pasta" ? "active" : ""}
            />
          </div>
          <div className="product-name-container">
            <p>Pasta</p>
          </div>
        </div>

        <div
          className="product-container"
          onClick={() => onCategorySelect("Asian food")}
        >
          <div className="product-img-container">
            <img
              src={AsianFoodImage}
              alt="Asian food"
              className={selectedCategory === "Asian food" ? "active" : ""}
            />
          </div>
          <div className="product-name-container">
            <p>Asian food</p>
          </div>
        </div>

        <div
          className="product-container"
          onClick={() => onCategorySelect("Mexican food")}
        >
          <div className="product-img-container">
            <img
              src={MexicanFoodImage}
              alt="Mexican food"
              className={selectedCategory === "Mexican food" ? "active" : ""}
            />
          </div>
          <div className="product-name-container">
            <p>Mexican food</p>
          </div>
        </div>

        <div
          className="product-container"
          onClick={() => onCategorySelect("Burgers")}
        >
          <div className="product-img-container">
            <img
              src={BurgersImage}
              alt="Burgers"
              className={selectedCategory === "Burgers" ? "active" : ""}
            />
          </div>
          <div className="product-name-container">
            <p>Burgers</p>
          </div>
        </div>

        <div
          className="product-container"
          onClick={() => onCategorySelect("Wraps")}
        >
          <div className="product-img-container">
            <img
              src={WrapsImage}
              alt="Wraps"
              className={selectedCategory === "Wraps" ? "active" : ""}
            />
          </div>
          <div className="product-name-container">
            <p>Wraps</p>
          </div>
        </div>

        <div
          className="product-container"
          onClick={() => onCategorySelect("Vegan food")}
        >
          <div className="product-img-container">
            <img
              src={VeganFoodImage}
              alt="Vegan food"
              className={selectedCategory === "Vegan food" ? "active" : ""}
            />
          </div>
          <div className="product-name-container">
            <p>Vegan food</p>
          </div>
        </div>

        <div
          className="product-container"
          onClick={() => onCategorySelect("Mediterranean food")}
        >
          <div className="product-img-container">
            <img
              src={MediterraneanFoodImage}
              alt="Mediterranean food"
              className={
                selectedCategory === "Mediterranean food" ? "active" : ""
              }
            />
          </div>
          <div className="product-name-container">
            <p>Mediterranean</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
