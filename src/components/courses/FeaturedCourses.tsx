
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  profiles?: {
    first_name: string;
    last_name: string;
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
              last_name
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
                <Button size="sm">
                  Enroll Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedCourses;
