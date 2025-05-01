
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FeaturedCourses from "@/components/courses/FeaturedCourses";

// Mock categories for filtering
const categories = {
  all: "All Courses",
  school: "School",
  college: "College",
  tech: "Tech",
  language: "Language",
  competitive: "Competitive Exams"
};

// Mock subcategories
const subcategories = {
  school: ["Class 1-5", "Class 6-8", "Class 9-10", "Class 11-12"],
  college: ["Undergraduate", "Postgraduate", "Professional Courses"],
  tech: ["C", "C++", "Java", "Python", "Web Development", "AutoCAD"],
  language: ["Hindi", "English", "Sanskrit", "Marathi", "Bengali", "Tamil"],
  competitive: ["IIT-JEE", "NEET", "SSC", "Banking", "UPSC", "CAT"]
};

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Get category from URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && Object.keys(categories).includes(category)) {
      setActiveCategory(category);
    } else {
      setActiveCategory("all");
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchParams({ category });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality when connected to Supabase
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center mb-12">
        <h1 className="font-sanskrit text-4xl md:text-5xl font-bold text-center mb-4">
          Explore Our <span className="text-indian-saffron">Courses</span>
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Browse our wide range of courses designed to help you excel in your academic journey.
          From school subjects to competitive exams, we have everything you need.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div>
                  <h3 className="font-medium mb-4">Search Courses</h3>
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    {Object.entries(categories).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleCategoryChange(key)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          activeCategory === key
                            ? "bg-indian-saffron/10 text-indian-saffron font-medium"
                            : "hover:bg-muted"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Subcategories - only show if a specific category is selected */}
                {activeCategory !== "all" && subcategories[activeCategory as keyof typeof subcategories] && (
                  <div>
                    <h3 className="font-medium mb-4">
                      {categories[activeCategory as keyof typeof categories]} Subcategories
                    </h3>
                    <div className="space-y-2">
                      {subcategories[activeCategory as keyof typeof subcategories].map((subcat, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`subcat-${index}`}
                            className="rounded border-gray-300 text-indian-saffron focus:ring-indian-saffron"
                          />
                          <label htmlFor={`subcat-${index}`} className="text-sm">
                            {subcat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-sanskrit font-bold">
                {categories[activeCategory as keyof typeof categories]}
              </h2>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              <FeaturedCourses />
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {/* This will be populated with list view of courses */}
                <p className="text-center text-muted-foreground py-12">
                  List view will be implemented with dynamic data from Supabase
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
