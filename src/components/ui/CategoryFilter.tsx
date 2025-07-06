interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category || 'all')}
          className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border ${
            selectedCategory === category
              ? 'bg-white/15 text-white border-white/30 shadow-lg shadow-white/10'
              : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'
          }`}
        >
          {/* Button content */}
          <span className="relative z-10">
            {category === 'all' ? 'All Work' : category}
          </span>

          {/* Hover shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>

          {/* Selected indicator */}
          {selectedCategory === category && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-white/15 to-white/10 animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}