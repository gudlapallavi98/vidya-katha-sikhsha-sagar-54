
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CourseCardProps {
  course: any;
  onSelectSlot: (course: any) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelectSlot,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCourseClick = async () => {
    console.log("Course selected:", course);
    
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
          amount: course.price || course.teacher_rate || 500,
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
      console.error('Course enrollment error:', error);
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : "Failed to start enrollment process. Please try again.",
      });
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
      onClick={handleCourseClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <Badge variant="outline" className="mt-1">
              Course
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 flex items-center">
              <IndianRupee className="h-5 w-5" />
              {course.price || course.teacher_rate || 500}
            </div>
            <p className="text-sm text-gray-500">full course</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span>{course.total_lessons} lessons</span>
          </div>
          <Badge variant="default" className="text-xs">
            Available
          </Badge>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Click to enroll in this course
        </div>
      </CardContent>
    </Card>
  );
};
