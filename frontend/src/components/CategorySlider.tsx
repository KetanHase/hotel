import React, { useState } from 'react';
import './CategorySlider.css'; // Import the updated CSS

interface CategorySliderProps {
  categories: { id: number; name: string; image: string }[];
  onCategoryClick: (categoryId: number | string) => void;
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories, onCategoryClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleSlides = 7; // Number of slides visible at a time

  const handleNext = () => {
    // Calculate the maximum index we can slide to
    const maxIndex = categories.length - visibleSlides;
    // Move forward but ensure we don't go beyond the last set of slides
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  const handlePrev = () => {
    // Move back, but stop if we reach the beginning
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="slider-container">
      {categories.length === 0 ? (
        <p className="no-data-message">No data in this category</p> // Display this when no categories are available
      ) : (
        <>
          <button className="slider-button left" onClick={handlePrev}>&lt;</button>
          <div className="slider">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)` }}
            >
              {categories.map((category) => (
                <div key={category.id} className="slide" onClick={() => onCategoryClick(category.id)}>
                  <img src={`http://localhost:8081/uploads/category/${category.image}`} alt={category.name} className="category-image" />
                  <p>{category.name}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="slider-button right" onClick={handleNext}>&gt;</button>
        </>
      )}
    </div>
  );
};

export default CategorySlider;
