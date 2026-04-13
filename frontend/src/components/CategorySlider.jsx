import React, { useState, useEffect, useRef } from "react";
import "../styles/CategorySlider.css";

const CategorySlider = ({ children, category }) => {
  const items = React.Children.toArray(children);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setVisibleCount(1);
      } else if (width <= 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(items.length);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [items.length]);

  useEffect(() => {
    setCurrentPage(0);
  }, [visibleCount]);

  const totalPages = Math.ceil(items.length / visibleCount);
  const startIndex = currentPage * visibleCount;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);

  if (totalPages <= 1) {
    return (
      <div className="category-slider">
        <h3 className="category-slider-title">{category}</h3>
        <div className="category-slider-items">{items}</div>
      </div>
    );
  }

  return (
    <div className="category-slider" ref={containerRef}>
      <h3 className="category-slider-title">{category}</h3>
      <div className="category-slider-items">{visibleItems}</div>
      <div className="category-slider-dots">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === currentPage ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
            aria-label={`Page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;