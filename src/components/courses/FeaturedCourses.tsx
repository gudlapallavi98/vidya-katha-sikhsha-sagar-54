
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  student_price: number;
  category: string;
  image_url?: string;
  teacher_id: string;
  total_lessons: number;
  created_at: string;
  is_published: boolean;
  teacher?: {
    first_name: string;
    last_name: string;
  };
}

export const FeaturedCourses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(first_name, last_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Course[];
    },
  });

  const handleEnrollment = async (course: Course) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to enroll in courses",
      });
      navigate('/login');
      return;
    }

    try {
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
          description: "You are already enrolled in this course",
        });
        return;
      }

      // Create enrollment
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: course.id,
          enrolled_at: new Date().toISOString(),
          completed_lessons: 0,
          last_accessed_at: new Date().toISOString()
        });

      if (enrollmentError) throw enrollmentError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert({
          user_id: user.id,
          amount: course.student_price || course.price,
          payment_type: 'course_enrollment',
          payment_status: 'completed',
          payment_method: 'direct',
          platform_fee: (course.student_price || course.price) * 0.1,
          teacher_payout: (course.student_price || course.price) * 0.9,
          notes: `Enrollment in course: ${course.title}`
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Enrollment Successful",
        description: "You have been enrolled in the course successfully!",
      });

      // Navigate to student dashboard with courses tab active
      navigate('/student-dashboard?tab=courses');
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: "Failed to enroll in the course. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <Badge variant="secondary">{course.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Teacher: {course.teacher?.first_name} {course.teacher?.last_name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.total_lessons} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-500">4.8 (124 reviews)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex justify-between items-center w-full">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{course.student_price || course.price}
                  </div>
                  <Button onClick={() => handleEnrollment(course)}>
                    Enroll Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
