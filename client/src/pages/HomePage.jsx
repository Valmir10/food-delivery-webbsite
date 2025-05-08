import React, { useState, useRef } from "react";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import Filter from "../components/Filter";
import Menu from "../components/Menu";
import "../styles/HomePage.css";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const menuRef = useRef(null);
  const homeRef = useRef(null);

  // Scroll to Menu section
  const scrollToMenu = () => {
    if (menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to Home section
  const scrollToHome = () => {
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsFilterActive(true);
    scrollToMenu(); // Scroll to Menu when a category is selected
  };

  const handleResetFilter = () => {
    setSelectedCategory("");
    setIsFilterActive(false);
  };

  return (
    <div className="home-page" ref={homeRef}>
      {" "}
      <Header scrollToMenu={scrollToMenu} scrollToHome={scrollToHome} />
      <Welcome onCategorySelect={handleCategorySelect} />
      <Filter
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <div ref={menuRef}>
        {" "}
        <Menu
          selectedCategory={selectedCategory}
          isFilterActive={isFilterActive}
          resetCategory={handleResetFilter}
        />
      </div>
    </div>
  );
};

export default HomePage;
