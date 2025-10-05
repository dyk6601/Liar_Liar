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
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">Choose a Category</h2>
        
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

        <div className="text-center">
          <Button
            onClick={onStartGame}
            variant="success"
            className="text-xl px-12"
            disabled={!selectedCategory}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
