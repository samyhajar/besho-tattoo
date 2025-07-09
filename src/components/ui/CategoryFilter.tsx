interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category || "all")}
          className={`group relative px-6 py-3 rounded-2xl font-light tracking-wide transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border ${
            selectedCategory === category
              ? "bg-black text-white border-black shadow-lg"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:text-black"
          }`}
        >
          {/* Button content */}
          <span className="relative z-10">
            {category === "all" ? "All Work" : category}
          </span>

          {/* Hover shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>

          {/* Selected indicator */}
          {selectedCategory === category && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-800 via-black to-gray-800" />
          )}
        </button>
      ))}
    </div>
  );
}
