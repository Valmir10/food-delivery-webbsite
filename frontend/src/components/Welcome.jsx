import { useState } from "react";
import "../styles/Welcome.css";

import welcomeImage from "../images/welcome-food-4.png";
import welcomeImage2 from "../images/pizza-welcome.png";
import welcomeImage3 from "../images/sallad-welcome.png";
import welcomeImage4 from "../images/asian-food-welcome.png";
import welcomeImage5 from "../images/mexican-food-welcome.png";

const CATEGORIES = [
  "Pizza", "Pasta", "Asian food", "Mexican food",
  "Burgers", "Wraps", "Vegan food", "Mediterranean food",
];

const Welcome = ({ onCategorySelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      setIsExpanded(true);
      const trimmed = value.trim().toLowerCase();
      const filtered = CATEGORIES.filter((c) =>
        c.toLowerCase().includes(trimmed),
      );
      setFilteredResults(filtered);
      setHighlightedIndex(0);
    } else {
      setIsExpanded(false);
      setFilteredResults([]);
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (category) => {
    onCategorySelect(category);
    setIsExpanded(false);
    setInputValue("");
  };

  const handleFindFood = () => {
    if (inputValue.length > 0 && filteredResults.length > 0) {
      handleSelect(filteredResults[highlightedIndex] || filteredResults[0]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFindFood();
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex((i) => Math.min(i + 1, filteredResults.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    }
  };

  return (
    <div className="welcome-section-container">
      <div className="welcome-inner">
        <div className="welcome-text-content">
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
              onKeyDown={handleKeyDown}
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
                      key={category}
                      className={`option-div ${highlightedIndex === index ? "highlighted" : ""}`}
                      onMouseOver={() => setHighlightedIndex(index)}
                      onClick={() => handleSelect(category)}
                    >
                      {category}
                    </div>
                  ))
                ) : (
                  <div className="option-div">No categories found</div>
                )}
              </div>
            )}
          </label>
        </div>

        <div className="welcome-images-grid">
          <img src={welcomeImage2} className="wi wi-tl" alt="pizza" />
          <img src={welcomeImage5} className="wi wi-tr" alt="mexican food" />
          <img src={welcomeImage} className="wi wi-center" alt="welcome" />
          <img src={welcomeImage4} className="wi wi-bl" alt="asian food" />
          <img src={welcomeImage3} className="wi wi-br" alt="salad" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;