
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculatePricing } from "@/utils/pricingUtils";

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

  // Get teacher rate and calculate pricing
  const teacherRate = type === 'individual' 
    ? (availability.price || availability.teacher_rate || 100)
    : (availability.price || availability.teacher_rate || 500);
  
  const pricing = calculatePricing(teacherRate);

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
      console.log("Updating session request with message:", message);

      // Find the session request that was created during payment
      const { data: sessionRequests, error: fetchError } = await supabase
        .from("session_requests")
        .select("*")
        .eq("student_id", user.id)
        .eq("teacher_id", teacherId)
        .eq("payment_status", "completed")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error("Error fetching session request:", fetchError);
        throw fetchError;
      }

      if (!sessionRequests || sessionRequests.length === 0) {
        throw new Error("No completed payment found for this session");
      }

      const sessionRequest = sessionRequests[0];

      // Update the session request with the message and set it ready for teacher review
      const { error: updateError } = await supabase
        .from("session_requests")
        .update({
          request_message: message || '',
          updated_at: new Date().toISOString()
        })
        .eq("id", sessionRequest.id);

      if (updateError) {
        console.error("Error updating session request:", updateError);
        throw updateError;
      }

      console.log("Session request updated successfully");

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
        description: "Your session request has been sent to the teacher for approval. You'll receive confirmation via email.",
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
