
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Video } from "lucide-react";

// Mock data for now (will be replaced with Supabase data later)
const mockCourses = [
  {
    id: 1,
    title: "Mathematics for Class 10",
    category: "school",
    subcategory: "Class 10",
    description: "Comprehensive mathematics course covering all CBSE Class 10 topics with practice questions and solved examples.",
    syllabus: "Algebra, Geometry, Trigonometry, Statistics",
    sample_video_url: "https://example.com/sample-math",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
  },
  {
    id: 2,
    title: "Advanced Java Programming",
    category: "tech",
    subcategory: "Java",
    description: "Master Java programming with practical applications and real-world projects.",
    syllabus: "Core Java, OOP, Collections, Multithreading, JDBC",
    sample_video_url: "https://example.com/sample-java",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
  },
  {
    id: 3,
    title: "English Language Mastery",
    category: "language",
    subcategory: "English",
    description: "Enhance your English communication skills with focus on grammar, vocabulary, and fluency.",
    syllabus: "Grammar, Vocabulary, Speaking, Writing, Comprehension",
    sample_video_url: "https://example.com/sample-english",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
  },
  {
    id: 4,
    title: "NEET Preparation",
    category: "competitive",
    subcategory: "NEET",
    description: "Comprehensive course for NEET aspirants covering Physics, Chemistry and Biology with extensive test series.",
    syllabus: "Physics, Chemistry, Biology, Practice Tests",
    sample_video_url: "https://example.com/sample-neet",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557",
  },
  {
    id: 5,
    title: "Financial Accounting",
    category: "college",
    subcategory: "Commerce",
    description: "Learn the fundamentals of financial accounting for undergraduate commerce students.",
    syllabus: "Basic Accounting, Financial Statements, Cost Accounting",
    sample_video_url: "https://example.com/sample-accounting",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
  },
  {
    id: 6,
    title: "Python for Data Science",
    category: "tech",
    subcategory: "Python",
    description: "Master Python programming for data analysis, visualization and machine learning.",
    syllabus: "Python Basics, NumPy, Pandas, Matplotlib, Scikit-Learn",
    sample_video_url: "https://example.com/sample-python",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
  }
];

const FeaturedCourses = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [loading, setLoading] = useState(true);

  // This will eventually fetch data from Supabase
  useEffect(() => {
    // Simulate API call
    const fetchCourses = async () => {
      try {
        // Will be replaced with Supabase query
        setTimeout(() => {
          setCourses(mockCourses);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="w-full h-96 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link key={course.id} to={`/courses/${course.id}`}>
          <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div 
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${course.image})` }}
            ></div>
            <CardContent className="p-6 flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-indian-saffron/10 text-indian-saffron rounded-full">
                  {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-indian-blue/10 text-indian-blue rounded-full">
                  {course.subcategory}
                </span>
              </div>
              <h3 className="font-sanskrit font-bold text-xl mb-2">{course.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {course.syllabus.split(", ").map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-muted rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 border-t flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">10+ lessons</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">50+ students</span>
                </div>
              </div>
              {course.sample_video_url && (
                <div className="flex items-center text-indian-saffron">
                  <Video className="h-4 w-4 mr-1" />
                  <span className="text-xs">Sample</span>
                </div>
              )}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedCourses;
