
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, User, Clock, DollarSign } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  teacher_id: string;
  is_published: boolean;
  image_url?: string;
  sample_video?: string;
  total_lessons: number;
  course_link?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    bio?: string;
    experience?: string;
  };
}

interface FeaturedCoursesProps {
  searchQuery?: string;
  selectedCategory?: string;
  selectedSubcategory?: string | null;
}

const FeaturedCourses = ({ 
  searchQuery = "", 
  selectedCategory = "all",
  selectedSubcategory = null 
}: FeaturedCoursesProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("courses")
          .select(`
            *,
            profiles:teacher_id (
              first_name,
              last_name,
              bio,
              experience
            )
          `)
          .eq("is_published", true); // Only show published courses

        // Apply category filter
        if (selectedCategory && selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        // Apply search filter
        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching courses:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load courses"
          });
          return;
        }

        console.log("Fetched courses:", data);
        setCourses(data || []);
      } catch (err) {
        console.error("Error in fetchCourses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  const handleEnrollment = async (course: Course) => {
    try {
      // Get the authenticated user from localStorage
      const authUser = localStorage.getItem('authenticated_user');
      if (!authUser) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to enroll in courses"
        });
        return;
      }

      const user = JSON.parse(authUser);
      
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', course.id)
        .single();

      if (existingEnrollment) {
        toast({
          title: "Already Enrolled",
          description: "You are already enrolled in this course"
        });
        return;
      }

      // Create enrollment
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: course.id,
          enrolled_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Enrollment Successful",
        description: `You have successfully enrolled in ${course.title}`
      });

      setSelectedCourse(null);
    } catch (error) {
      console.error("Enrollment error:", error);
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: "Something went wrong. Please try again."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-80">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No courses found</h3>
        <p className="text-muted-foreground">
          {searchQuery ? 
            `No courses match your search "${searchQuery}"` : 
            "No published courses available in this category"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-2 text-lg">
                {course.title}
              </CardTitle>
              <Badge variant="secondary">
                {course.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              by {course.profiles?.first_name} {course.profiles?.last_name}
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
              {course.description}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {course.total_lessons} lessons
                </span>
                <span className="font-bold text-lg">
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
              </div>
              <div className="flex gap-2">
                {course.sample_video && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(course.sample_video, '_blank')}
                  >
                    Preview
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setSelectedCourse(course)}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{course.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm">
                            {course.profiles?.first_name} {course.profiles?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-sm">{course.total_lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">
                            {course.price === 0 ? "Free" : `₹${course.price}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Course Description</h4>
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      </div>
                      
                      {course.profiles?.bio && (
                        <div>
                          <h4 className="font-semibold mb-2">About the Teacher</h4>
                          <p className="text-sm text-muted-foreground">{course.profiles.bio}</p>
                        </div>
                      )}
                      
                      {course.profiles?.experience && (
                        <div>
                          <h4 className="font-semibold mb-2">Experience</h4>
                          <p className="text-sm text-muted-foreground">{course.profiles.experience}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                        {course.sample_video && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(course.sample_video, '_blank')}
                          >
                            Preview Course
                          </Button>
                        )}
                        {course.course_link && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(course.course_link, '_blank')}
                          >
                            Course Materials
                          </Button>
                        )}
                        <Button 
                          className="flex-1"
                          onClick={() => handleEnrollment(course)}
                        >
                          Enroll Now - ₹{course.price || 0}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedCourses;
