import React, { useState, useEffect } from "react"; // Lägg till useEffect
import axios from "axios";
import "./Welcome.css";

import welcomeImage from "../images/welcome-food-4.png";
import welcomeImage2 from "../images/pizza-welcome.png";
import welcomeImage3 from "../images/sallad-welcome.png";
import welcomeImage4 from "../images/asian-food-welcome.png";
import welcomeImage5 from "../images/mexican-food-welcome.png";

const Welcome = ({ onCategorySelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Hämta kategorier från API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(
          "http://localhost:5001/api/categories"
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      setIsExpanded(true);
      filterResults(value);
    } else {
      setIsExpanded(false);
      setFilteredResults([]);
      setHighlightedIndex(-1);
    }
  };

  const filterResults = (query) => {
    const trimmedQuery = query.trim().toLowerCase();
    const filteredCategories = categories.filter((category) =>
      category.name.trim().toLowerCase().includes(trimmedQuery)
    );
    setFilteredResults(filteredCategories);
    setHighlightedIndex(0);
  };

  const handleMouseOver = (index) => {
    setHighlightedIndex(index);
  };

  const handleSelect = (category) => {
    onCategorySelect(category.name);
    setIsExpanded(false);
    setInputValue("");
  };

  const handleFindFood = () => {
    if (inputValue.length > 0 && filteredResults.length > 0) {
      handleSelect(filteredResults[highlightedIndex]);
    }
  };

  return (
    <div className="welcome-section-container">
      <div className="welcome-text-container">
        <p className="welcome-text-1">We Deliver The</p>
        <p className="welcome-text-2">Taste Of Life</p>
        <p className="welcome-text-3">Get It Delivered Right To Your Door!</p>
        <label
          className={`searchbox-container ${isExpanded ? "expanded" : ""}`}
        >
          <input
            type="text"
            placeholder="Enter Food Name"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="find-food-button"
            onClick={handleFindFood}
          >
            Find Food
          </button>

          {isExpanded && (
            <div className="search-results">
              {filteredResults.length > 0 ? (
                filteredResults.map((category, index) => (
                  <div
                    key={category._id || index}
                    className={`option-div ${
                      highlightedIndex === index ? "highlighted" : ""
                    }`}
                    onMouseOver={() => handleMouseOver(index)}
                    onClick={() => handleSelect(category)}
                  >
                    {category.name}
                  </div>
                ))
              ) : (
                <div className="option-div">No categories found</div>
              )}
            </div>
          )}
        </label>
        <img src={welcomeImage} className="welcome-image-1" alt="welcome" />
        <img src={welcomeImage2} className="welcome-image-2" alt="pizza" />
        <img src={welcomeImage3} className="welcome-image-3" alt="salad" />
        <img src={welcomeImage4} className="welcome-image-4" alt="asian food" />
        <img
          src={welcomeImage5}
          className="welcome-image-5"
          alt="mexican food"
        />
      </div>
    </div>
  );
};

export default Welcome;
