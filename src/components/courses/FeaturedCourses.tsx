
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, User, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  total_lessons: number;
  is_published: boolean;
  teacher_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface FeaturedCoursesProps {
  searchQuery?: string;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

const FeaturedCourses = ({ 
  searchQuery = "", 
  selectedCategory = "",
  selectedSubcategory = ""
}: FeaturedCoursesProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("courses")
        .select(`
          *,
          profiles:teacher_id (
            first_name,
            last_name
          )
        `)
        .eq("is_published", true); // Only show published courses

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      // Apply category filter
      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load courses",
        });
        return;
      }

      setCourses(data || []);
    } catch (error) {
      console.error("Error in fetchCourses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load courses",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">
          {searchQuery || selectedCategory ? "No courses found" : "No courses available"}
        </h3>
        <p className="text-muted-foreground">
          {searchQuery || selectedCategory 
            ? "Try adjusting your search or filters" 
            : "Check back later for new courses"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={course.image_url || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <Badge className="absolute top-2 right-2" variant="secondary">
              {course.category}
            </Badge>
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                {course.profiles?.first_name} {course.profiles?.last_name}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {course.description}
            </p>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.total_lessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.5</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-indian-blue">
                ₹{course.price?.toLocaleString() || 0}
              </div>
              <Button size="sm" className="bg-indian-green hover:bg-indian-green/90">
                Enroll Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedCourses;
