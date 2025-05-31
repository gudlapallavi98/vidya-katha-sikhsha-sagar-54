
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculatePricing, createPaymentRecord } from "@/utils/pricingUtils";

interface UseSessionRequestFormProps {
  teacherId: string;
  availability: any;
  type: 'individual' | 'course';
  onSuccess: () => void;
}

export const useSessionRequestForm = ({
  teacherId,
  availability,
  type,
  onSuccess
}: UseSessionRequestFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  };

  // Get teacher rate and calculate pricing
  const teacherRate = type === 'individual' 
    ? (availability.price || availability.teacher_rate || 100)
    : (availability.price || availability.teacher_rate || 500);
  
  const pricing = calculatePricing(teacherRate);

  // Format date and time for database storage
  const formatDateTimeForDB = (dateStr: string, timeStr?: string) => {
    try {
      if (type === 'individual' && dateStr && timeStr) {
        // For individual sessions, combine the availability date and start time
        // dateStr is in YYYY-MM-DD format, timeStr is in HH:MM format
        const dateTime = new Date(`${dateStr}T${timeStr}:00`);
        console.log("Formatting individual session:", { dateStr, timeStr, result: dateTime.toISOString() });
        return dateTime.toISOString();
      } else {
        // For course enrollment, use current time
        return new Date().toISOString();
      }
    } catch (error) {
      console.error("Error formatting date time:", error, { dateStr, timeStr });
      return new Date().toISOString();
    }
  };

  const submitRequest = async (message: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to submit a session request.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting session request with data:", {
        user: user.id,
        teacherId,
        availability,
        type,
        pricing
      });

      // Create proper date object using the teacher's availability
      const proposedDate = formatDateTimeForDB(
        availability.available_date,
        availability.start_time
      );

      console.log("Proposed date calculation:", {
        availableDate: availability.available_date,
        startTime: availability.start_time,
        proposedDate
      });

      const sessionData = {
        student_id: user.id,
        teacher_id: teacherId,
        proposed_title: type === 'individual' 
          ? `${availability.subject?.name || 'Session'} - Individual Session` 
          : availability.title || 'Course Session',
        request_message: message || '',
        proposed_date: proposedDate,
        proposed_duration: type === 'individual' 
          ? calculateDuration(availability.start_time, availability.end_time)
          : 60,
        status: "pending",
        course_id: type === 'course' ? availability.id : null,
        availability_id: type === 'individual' ? availability.id : null,
        payment_amount: pricing.studentAmount,
        payment_status: "completed",
        session_type: type,
        priority_level: "normal"
      };

      console.log("Session data to insert:", sessionData);

      // Insert session request
      const { data: sessionRequest, error } = await supabase
        .from("session_requests")
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Session request created successfully:", sessionRequest);

      // Create payment record
      try {
        await createPaymentRecord(
          user.id,
          sessionRequest.id,
          null,
          pricing,
          'student_payment',
          'completed'
        );
        console.log("Payment record created successfully");
      } catch (paymentError) {
        console.error("Error creating payment record:", paymentError);
        // Don't fail the entire flow if payment record creation fails
      }

      // Update availability status if it's an individual session
      if (type === 'individual' && availability.id) {
        const { error: updateError } = await supabase
          .from("teacher_availability")
          .update({ 
            status: "booked",
            booked_students: (availability.booked_students || 0) + 1
          })
          .eq("id", availability.id);

        if (updateError) {
          console.error("Error updating availability:", updateError);
        }
      }

      toast({
        title: "Request Submitted Successfully",
        description: "Your session request has been sent to the teacher. You'll receive confirmation via email.",
      });

      onSuccess();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pricing,
    isLoading,
    submitRequest
  };
};
