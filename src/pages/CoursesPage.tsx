import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CourseFilters from "@/components/courses/filters/CourseFilters";
import CourseContent from "@/components/courses/CourseContent";

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
  const [loading, setLoading] = useState(true);

  // Get category from URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    const searchParam = searchParams.get("search");
    
    if (category && Object.keys(categories).includes(category)) {
      setActiveCategory(category);
    } else {
      setActiveCategory("all");
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    console.log("Category changed to:", category);
    setActiveCategory(category);
    setSelectedSubcategory(null); // Reset subcategory when changing category
    
    // Update URL params but keep search query if it exists
    const params: any = { category };
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
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
    
    // Update the URL params
    const params: any = {};
    if (activeCategory !== "all") params.category = activeCategory;
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
        <CourseFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          handleCategoryChange={handleCategoryChange}
          categories={categories}
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          handleSubcategoryChange={handleSubcategoryChange}
          subjects={subjects}
          selectedSubjects={selectedSubjects}
          handleSubjectChange={handleSubjectChange}
          handleResetFilters={handleResetFilters}
          handleSearch={handleSearch}
        />
        
        <CourseContent 
          activeCategory={activeCategory} 
          selectedSubcategory={selectedSubcategory}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default CoursesPage;
