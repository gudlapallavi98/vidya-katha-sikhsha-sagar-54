
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  categories: Record<string, string>;
  activeCategory: string;
  handleCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, handleCategoryChange }: CategoryFilterProps) => {
  return (
    <div>
      <h3 className="font-medium mb-4">Categories</h3>
      <RadioGroup value={activeCategory} onValueChange={handleCategoryChange}>
        {Object.entries(categories).map(([key, label]) => (
          <div key={key} className="flex items-center space-x-2 py-1">
            <RadioGroupItem value={key} id={`category-${key}`} />
            <Label 
              htmlFor={`category-${key}`}
              className="text-sm cursor-pointer"
            >
              {label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default CategoryFilter;
