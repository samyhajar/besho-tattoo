import { useState, useEffect } from "react";
import { getExistingCategories } from "@/services/tattoos";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export default function CategoryInput({
  value,
  onChange,
  disabled = false,
  required = false,
  label = "Category",
  placeholder = "Enter new category or click existing one below",
}: CategoryInputProps) {
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getExistingCategories();
        setExistingCategories(categories);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    onChange(category);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Check if current value matches an existing category
  const isExistingCategory = existingCategories.some(
    (cat) => cat.toLowerCase() === value.toLowerCase(),
  );

  return (
    <div className="space-y-3">
      <Label htmlFor="category">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Input
        id="category"
        name="category"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${isExistingCategory && value ? "border-green-300 bg-green-50" : ""}`}
      />

      {/* Helpful message */}
      {existingCategories.length > 0 && (
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            💡 <strong>Tip:</strong> Click an existing category below to avoid
            duplicates, or type a new one above.
          </p>

          {/* Existing categories as clickable bubbles */}
          <div className="flex flex-wrap gap-2">
            {existingCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                disabled={disabled}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border ${
                  value.toLowerCase() === category.toLowerCase()
                    ? "bg-blue-100 text-blue-800 border-blue-300 shadow-sm"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:text-gray-900 hover:border-gray-300"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-sm text-gray-500">
          Loading existing categories...
        </div>
      )}

      {/* Show validation message for duplicate detection */}
      {isExistingCategory && value && (
        <div className="text-sm text-green-600 font-medium">
          ✓ Using existing category: &ldquo;{value}&rdquo;
        </div>
      )}
    </div>
  );
}
