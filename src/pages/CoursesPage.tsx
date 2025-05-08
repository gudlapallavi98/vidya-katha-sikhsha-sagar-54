
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FeaturedCourses from "@/components/courses/FeaturedCourses";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

// Mock subjects for filtering
const subjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
  "Political Science",
  "Sanskrit",
  "Hindi"
];

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
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
    setSelectedSubcategory(null); // Reset subcategory when changing category
    setSearchParams({ category });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory === selectedSubcategory ? null : subcategory);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects(
      selectedSubjects.includes(subject)
        ? selectedSubjects.filter(s => s !== subject)
        : [...selectedSubjects, subject]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log search parameters
    console.log("Searching for:", {
      query: searchQuery,
      category: activeCategory,
      subcategory: selectedSubcategory,
      subjects: selectedSubjects
    });
    
    // Here we would normally fetch from Supabase with these filters
    // For now, we'll just update the URL params
    const params: any = { category: activeCategory };
    if (searchQuery) params.search = searchQuery;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (selectedSubjects.length > 0) params.subjects = selectedSubjects.join(',');
    
    setSearchParams(params);
  };

  // Reset filter button
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSelectedSubcategory(null);
    setSelectedSubjects([]);
    setSearchParams({});
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
                    <div className="mt-2 flex justify-end">
                      <Button type="submit" size="sm">Search</Button>
                    </div>
                  </form>
                </div>
                
                {/* Categories */}
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
                
                {/* Subcategories - only show if a specific category is selected */}
                {activeCategory !== "all" && subcategories[activeCategory as keyof typeof subcategories] && (
                  <div>
                    <h3 className="font-medium mb-4">
                      {categories[activeCategory as keyof typeof categories]} Subcategories
                    </h3>
                    <div className="space-y-2">
                      {subcategories[activeCategory as keyof typeof subcategories].map((subcat) => (
                        <div key={subcat} className="flex items-center space-x-2 py-1">
                          <RadioGroupItem
                            value={subcat}
                            id={`subcat-${subcat}`}
                            checked={selectedSubcategory === subcat}
                            onClick={() => handleSubcategoryChange(subcat)}
                          />
                          <Label 
                            htmlFor={`subcat-${subcat}`}
                            className="text-sm cursor-pointer"
                          >
                            {subcat}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subjects filter */}
                <div>
                  <h3 className="font-medium mb-4">Subjects</h3>
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`subject-${subject}`} 
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => handleSubjectChange(subject)}
                        />
                        <label
                          htmlFor={`subject-${subject}`}
                          className="text-sm cursor-pointer"
                        >
                          {subject}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

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
        
        {/* Main content */}
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
