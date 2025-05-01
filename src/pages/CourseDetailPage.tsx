
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Video, Users, CheckCircle } from "lucide-react";

// Mock data for a course (will be replaced with Supabase data)
const mockCourseData = {
  id: "1",
  title: "Mathematics for Class 10",
  category: "school",
  subcategory: "Class 10",
  description: "A comprehensive mathematics course covering all CBSE Class 10 topics with practice questions and solved examples. This course is designed to help students excel in their board examinations and build a strong foundation for higher studies.",
  syllabus: "Algebra, Geometry, Trigonometry, Statistics, Probability",
  sample_video_url: "https://example.com/sample-math",
  image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
  price: 2999,
  duration: "3 months",
  totalLessons: 45,
  rating: 4.8,
  studentsEnrolled: 520,
  teacher: {
    id: 1,
    name: "Dr. Ravi Kumar",
    qualification: "Ph.D in Mathematics, IIT Delhi",
    experience: "15+ years of teaching experience",
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  syllabusDetails: [
    {
      title: "Real Numbers",
      topics: ["Euclid's Division Lemma", "The Fundamental Theorem of Arithmetic", "Revisiting Rational Numbers and Their Decimal Expansions"],
      duration: "6 hours"
    },
    {
      title: "Polynomials",
      topics: ["Geometrical Meaning of the Zeroes of a Polynomial", "Relationship between Zeroes and Coefficients of a Polynomial", "Division Algorithm for Polynomials"],
      duration: "8 hours"
    },
    {
      title: "Pair of Linear Equations in Two Variables",
      topics: ["Graphical Method of Solution of a Pair of Linear Equations", "Algebraic Methods of Solving a Pair of Linear Equations", "Equations Reducible to a Pair of Linear Equations in Two Variables"],
      duration: "7 hours"
    },
    {
      title: "Quadratic Equations",
      topics: ["Standard Form of a Quadratic Equation", "Solutions of Quadratic Equations by Factorization", "Solutions of Quadratic Equations by Completing the Square", "Nature of Roots"],
      duration: "8 hours"
    },
    {
      title: "Arithmetic Progressions",
      topics: ["Arithmetic Progressions", "nth Term of an AP", "Sum of First n Terms of an AP", "Applications of Arithmetic Progressions"],
      duration: "6 hours"
    }
  ]
};

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [courseData, setCourseData] = useState(mockCourseData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // This will be replaced with Supabase query
    // For now just simulate API call with mock data
    setTimeout(() => {
      setCourseData(mockCourseData);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-72 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 col-span-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/courses" className="text-sm text-muted-foreground hover:text-indian-blue">
            Courses
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <Link to={`/courses?category=${courseData.category}`} className="text-sm text-muted-foreground hover:text-indian-blue">
            {courseData.category.charAt(0).toUpperCase() + courseData.category.slice(1)}
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm">{courseData.subcategory}</span>
        </div>
        <h1 className="font-sanskrit text-3xl md:text-4xl font-bold mb-4">{courseData.title}</h1>
        <p className="text-muted-foreground mb-6">{courseData.description}</p>
        
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{courseData.studentsEnrolled} students enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Duration: {courseData.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{courseData.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`h-5 w-5 ${star <= Math.floor(courseData.rating) ? "text-indian-saffron" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 15.585l-7.01 3.684 1.336-7.79L.506 7.282l7.834-1.137L10 0l1.66 6.145 7.834 1.137-3.82 3.725 1.336 7.79L10 15.585z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <span className="text-sm">{courseData.rating} ({courseData.studentsEnrolled} reviews)</span>
          </div>
        </div>
      </div>

      {/* Course Image and Enrollment Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 rounded-lg overflow-hidden">
          <img 
            src={courseData.image}
            alt={courseData.title}
            className="w-full h-80 object-cover"
          />
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">₹{courseData.price}</span>
                {courseData.sample_video_url && (
                  <Button variant="outline" className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    <span>Watch Sample</span>
                  </Button>
                )}
              </div>
              
              <Button className="w-full bg-indian-saffron hover:bg-indian-saffron/90">
                Enroll Now
              </Button>
              
              <div className="space-y-3">
                <h3 className="font-medium">This course includes:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-indian-blue" />
                    <span>{courseData.totalLessons} video lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indian-blue" />
                    <span>{courseData.duration} access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indian-blue" />
                    <span>Live tutoring sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indian-blue" />
                    <span>Practice assignments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indian-blue" />
                    <span>Completion certificate</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            <h2 className="font-sanskrit text-2xl font-bold">Course Overview</h2>
            <p className="text-muted-foreground">
              {courseData.description}
            </p>
            <div>
              <h3 className="font-medium mb-3">What you will learn:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {courseData.syllabus.split(", ").map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-indian-green mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="syllabus">
          <div className="space-y-6">
            <h2 className="font-sanskrit text-2xl font-bold">Course Syllabus</h2>
            <div className="space-y-6">
              {courseData.syllabusDetails.map((section, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">{section.title}</h3>
                      <span className="text-sm text-muted-foreground">{section.duration}</span>
                    </div>
                    <ul className="space-y-2">
                      {section.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-indian-green/20 flex items-center justify-center mt-0.5">
                            <span className="text-xs text-indian-green">{topicIndex + 1}</span>
                          </div>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="teacher">
          <div className="space-y-6">
            <h2 className="font-sanskrit text-2xl font-bold">About the Teacher</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img 
                  src={courseData.teacher.image}
                  alt={courseData.teacher.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{courseData.teacher.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{courseData.teacher.qualification}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`h-5 w-5 ${star <= Math.floor(courseData.teacher.rating) ? "text-indian-saffron" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 15.585l-7.01 3.684 1.336-7.79L.506 7.282l7.834-1.137L10 0l1.66 6.145 7.834 1.137-3.82 3.725 1.336 7.79L10 15.585z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm">{courseData.teacher.rating} Teacher Rating</span>
                </div>
                <p className="mb-4">
                  {courseData.teacher.experience}
                </p>
                <Button variant="outline">View Full Profile</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="space-y-6">
            <h2 className="font-sanskrit text-2xl font-bold">Student Reviews</h2>
            <p className="text-center py-12 text-muted-foreground">
              Review system will be implemented with Supabase integration.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Courses */}
      <div className="space-y-6">
        <h2 className="font-sanskrit text-2xl font-bold">Related Courses</h2>
        <p className="text-center py-12 text-muted-foreground">
          Related courses will be fetched from Supabase based on category and subcategory.
        </p>
      </div>
    </div>
  );
};

export default CourseDetailPage;
