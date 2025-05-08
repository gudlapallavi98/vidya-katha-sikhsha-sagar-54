
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CourseSearch from "./CourseSearch";
import CategoryFilter from "./CategoryFilter";
import SubcategoryFilter from "./SubcategoryFilter";
import SubjectFilter from "./SubjectFilter";
import { FormEvent } from "react";

interface CourseFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  handleCategoryChange: (category: string) => void;
  categories: Record<string, string>;
  subcategories: Record<string, string[]>;
  selectedSubcategory: string | null;
  handleSubcategoryChange: (subcategory: string) => void;
  subjects: string[];
  selectedSubjects: string[];
  handleSubjectChange: (subject: string) => void;
  handleResetFilters: () => void;
  handleSearch: (e: FormEvent) => void;
}

const CourseFilters = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  handleCategoryChange,
  categories,
  subcategories,
  selectedSubcategory,
  handleSubcategoryChange,
  subjects,
  selectedSubjects,
  handleSubjectChange,
  handleResetFilters,
  handleSearch,
}: CourseFiltersProps) => {
  return (
    <div className="w-full md:w-1/4">
      <div className="sticky top-24">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Search */}
            <CourseSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              onSearch={handleSearch}
            />
            
            {/* Categories */}
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              handleCategoryChange={handleCategoryChange}
            />
            
            {/* Subcategories - only show if a specific category is selected */}
            {activeCategory !== "all" && subcategories[activeCategory as keyof typeof subcategories] && (
              <SubcategoryFilter 
                categoryTitle={categories[activeCategory as keyof typeof categories]}
                subcategories={subcategories[activeCategory as keyof typeof subcategories]}
                selectedSubcategory={selectedSubcategory}
                handleSubcategoryChange={handleSubcategoryChange}
              />
            )}

            {/* Subjects filter */}
            <SubjectFilter 
              subjects={subjects}
              selectedSubjects={selectedSubjects}
              handleSubjectChange={handleSubjectChange}
            />

            {/* Reset filters */}
            <div className="pt-2">
              <Button variant="outline" onClick={handleResetFilters} className="w-full">
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseFilters;
