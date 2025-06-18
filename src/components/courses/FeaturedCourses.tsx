
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

interface FeaturedCoursesProps {
  searchQuery?: string;
  selectedCategory?: string;
  selectedSubcategory?: string | null;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({ 
  searchQuery = "",
  selectedCategory = "all",
  selectedSubcategory = null
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['featured-courses', searchQuery, selectedCategory, selectedSubcategory],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(first_name, last_name)
        `)
        .eq('is_published', true);

      // Apply category filter
      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Filter by subcategory on the client side if needed
      let filteredData = data as Course[];
      if (selectedSubcategory) {
        // For now, we'll just return all courses since subcategory logic needs to be defined
        // This can be extended based on how subcategories are stored in the database
        filteredData = data as Course[];
      }
      
      return filteredData;
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
        navigate('/student-dashboard?tab=courses');
        return;
      }

      // Create payment session directly using Cashfree
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('cashfree-payment', {
        body: {
          action: 'create_payment',
          amount: course.student_price || course.price,
          order_id: `COURSE_${course.id}_${user.id}_${Date.now()}`,
          customer_details: {
            customer_id: user.id,
            customer_email: user.email,
            customer_phone: '9999999999'
          },
          order_meta: {
            course_id: course.id,
            student_id: user.id,
            teacher_id: course.teacher_id,
            payment_type: 'course_enrollment',
            course_title: course.title
          }
        }
      });

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        throw new Error('Failed to create payment session');
      }

      console.log("Payment session created:", paymentData);

      if (paymentData?.payment_session_id) {
        // Open payment in new tab
        const paymentUrl = `https://payments.cashfree.com/order/#${paymentData.payment_session_id}`;
        window.open(paymentUrl, '_blank');
        
        toast({
          title: "Payment Gateway Opened",
          description: "Complete your payment in the new tab to enroll in the course.",
        });
      } else {
        throw new Error('Invalid payment session response');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : "Failed to start enrollment process. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
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
    );
  }

  if (courses.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
          <BookOpen className="h-16 w-16 text-muted-foreground/60" />
          <h3 className="text-xl font-medium">No Courses Found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? `No courses found for "${searchQuery}"` : "No courses available in this category"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
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
  );
};

export default FeaturedCourses;
