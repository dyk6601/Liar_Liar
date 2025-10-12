// pages/CategoryPage.jsx
// Purpose: Let the host pick a word category before the round starts.
// Props:
//  - categories: array of category keys (strings)
//  - selectedCategory: currently selected key
//  - onSelectCategory(key): setter called when a card is chosen
//  - onStartGame(): starts the game once a category is chosen
// UX note: Category selection is single-choice; CategoryCard receives the
// `isSelected` flag and should visually communicate selection clearly.
import React from 'react';
import CategoryCard from '../components/CategoryCard.jsx';
import Button from '../components/button.jsx';

const CategoryPage = ({ categories, selectedCategory, onSelectCategory, onStartGame }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Yappie Image */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center shadow-lg border-4 border-gray-800 overflow-hidden">
            <img 
              src="/img/yappie.png" 
              alt="Yappie"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to folder emoji if image fails to load
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-4xl">📂</span>';
              }}
            />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 drop-shadow-sm">Choose a Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onSelect={onSelectCategory}
            />
          ))}
        </div>

        <Button
          onClick={onStartGame}
          variant="success"
          className="w-full md:w-64 text-lg py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg border-4 border-gray-800 transition-transform hover:scale-105 active:scale-95"
          disabled={!selectedCategory}
        >
          Start Game
        </Button>
        
        {/* Decorative dots */}
        <div className="flex justify-center gap-3 mt-8">
          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
