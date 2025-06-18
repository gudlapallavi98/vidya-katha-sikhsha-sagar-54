
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface CourseDetailsEnrollmentProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    teacher_id: string;
    image_url?: string;
    category: string;
    total_lessons: number;
    is_published: boolean;
  };
  teacher: {
    first_name: string;
    last_name: string;
    bio?: string;
    avatar_url?: string;
  };
}

export const CourseDetailsEnrollment: React.FC<CourseDetailsEnrollmentProps> = ({
  course,
  teacher
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnrollNow = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to enroll in this course.",
      });
      navigate("/login");
      return;
    }

    console.log("Starting direct course enrollment for course:", course.id);
    setIsEnrolling(true);
    
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
          amount: course.price,
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
      console.error("Error during course enrollment:", error);
      toast({
        variant: "destructive",
        title: "Enrollment Failed", 
        description: error instanceof Error ? error.message : "Failed to start enrollment process.",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {course.image_url && (
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Category: {course.category}</span>
              <span>Lessons: {course.total_lessons}</span>
              <span>Status: {course.is_published ? 'Published' : 'Draft'}</span>
            </div>
          </div>

          {/* Teacher Information */}
          <Card>
            <CardHeader>
              <CardTitle>About the Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {teacher.avatar_url && (
                  <img
                    src={teacher.avatar_url}
                    alt={`${teacher.first_name} ${teacher.last_name}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {teacher.first_name} {teacher.last_name}
                  </h3>
                  {teacher.bio && (
                    <p className="text-muted-foreground mt-2">{teacher.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Enroll in this Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  ₹{course.price}
                </div>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>

              <Button 
                onClick={handleEnrollNow}
                disabled={isEnrolling || !course.is_published}
                className="w-full"
                size="lg"
              >
                {isEnrolling ? "Opening Payment..." : "Enroll Now"}
              </Button>

              {!course.is_published && (
                <p className="text-sm text-amber-600 text-center">
                  This course is not yet published
                </p>
              )}

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Total Lessons:</span>
                  <span>{course.total_lessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{course.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Access:</span>
                  <span>Lifetime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
