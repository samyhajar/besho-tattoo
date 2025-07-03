interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category || 'all')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
            selectedCategory === category
              ? 'bg-white text-black'
              : 'bg-transparent text-white border border-white/30 hover:border-white/60'
          }`}
        >
          {category === 'all' ? 'All Work' : category}
        </button>
      ))}
    </div>
  );
}