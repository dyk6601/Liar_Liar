// components/CategoryCard.jsx
// components/CategoryCard.jsx
// Single selectable category tile. Parent controls `isSelected` state.
// Props: category (string), isSelected (bool), onSelect(category)
const CategoryCard = ({ category, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(category)}
      className={`p-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg border-4 border-gray-800 ${
        isSelected
          ? 'bg-red-500 text-white scale-105 shadow-xl'
          : 'bg-amber-50 text-gray-800 hover:bg-amber-100'
      }`}
    >
      {category}
    </button>
  );
};
export default CategoryCard;