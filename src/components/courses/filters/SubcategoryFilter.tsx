
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SubcategoryFilterProps {
  categoryTitle: string;
  subcategories: string[];
  selectedSubcategory: string | null;
  handleSubcategoryChange: (subcategory: string) => void;
}

const SubcategoryFilter = ({ 
  categoryTitle, 
  subcategories, 
  selectedSubcategory, 
  handleSubcategoryChange 
}: SubcategoryFilterProps) => {
  return (
    <div>
      <h3 className="font-medium mb-4">
        {categoryTitle} Subcategories
      </h3>
      <div className="space-y-2">
        <RadioGroup 
          value={selectedSubcategory || ""} 
          onValueChange={handleSubcategoryChange}
        >
          {subcategories.map((subcat) => (
            <div key={subcat} className="flex items-center space-x-2 py-1">
              <RadioGroupItem value={subcat} id={`subcat-${subcat}`} />
              <Label 
                htmlFor={`subcat-${subcat}`}
                className="text-sm cursor-pointer"
              >
                {subcat}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default SubcategoryFilter;
