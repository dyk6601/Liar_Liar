// components/CategoryCard.jsx
const CategoryCard = ({ category, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(category)}
      className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
        isSelected
          ? 'bg-white text-purple-600 shadow-2xl scale-105'
          : 'bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100'
      }`}
    >
      {category}
    </button>
  );
};
export default CategoryCard;