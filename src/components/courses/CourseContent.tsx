
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeaturedCourses from "@/components/courses/FeaturedCourses";

interface CourseContentProps {
  activeCategory: string;
  selectedSubcategory: string | null;
  categories: Record<string, string>;
  searchQuery?: string;
}

const CourseContent = ({ 
  activeCategory, 
  selectedSubcategory,
  categories,
  searchQuery = ""
}: CourseContentProps) => {
  return (
    <div className="w-full md:w-3/4">
      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-sanskrit font-bold">
            {categories[activeCategory as keyof typeof categories]}
            {selectedSubcategory && ` - ${selectedSubcategory}`}
          </h2>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="mt-0">
          <FeaturedCourses 
            searchQuery={searchQuery}
            selectedCategory={activeCategory}
            selectedSubcategory={selectedSubcategory}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            <FeaturedCourses 
              searchQuery={searchQuery}
              selectedCategory={activeCategory}
              selectedSubcategory={selectedSubcategory}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseContent;
