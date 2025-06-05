
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculatePricing } from "@/utils/pricingUtils";
import { SessionRequestState } from "./SessionRequestState";

export const useSessionRequestHandlers = (
  state: SessionRequestState,
  setState: React.Dispatch<React.SetStateAction<SessionRequestState>>
) => {
  const { user } = useAuth();

  const calculateDurationFromTimeSlot = (startTime: string, endTime: string): number => {
    try {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const durationMs = end.getTime() - start.getTime();
      return Math.floor(durationMs / (1000 * 60));
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 60;
    }
  };

  const handleSelectTeacher = (teacherId: string) => {
    setState(prev => ({
      ...prev,
      selectedTeacherId: teacherId,
      step: "select-availability"
    }));
  };

  const handleSelectSlot = async (slot: any) => {
    if (!user) return;

    const type = slot.session_type === 'individual' ? 'individual' : 'course';
    
    setState(prev => ({
      ...prev,
      selectedAvailability: slot,
      availabilityType: type
    }));

    try {
      const teacherRate = type === 'individual' 
        ? (slot.price || slot.teacher_rate || 100)
        : (slot.price || slot.teacher_rate || 500);
      
      const pricing = calculatePricing(teacherRate);

      const proposedDate = type === 'individual' && slot.available_date && slot.start_time
        ? new Date(`${slot.available_date}T${slot.start_time}:00`).toISOString()
        : new Date().toISOString();

      const proposedDuration = type === 'individual' && slot.start_time && slot.end_time
        ? calculateDurationFromTimeSlot(slot.start_time, slot.end_time)
        : 60;

      const sessionData = {
        student_id: user.id,
        teacher_id: state.selectedTeacherId,
        proposed_title: type === 'individual' 
          ? `${slot.subject?.name || 'Session'} - Individual Session` 
          : slot.title || 'Course Session',
        request_message: '',
        proposed_date: proposedDate,
        proposed_duration: proposedDuration,
        status: "payment_pending",
        course_id: type === 'course' ? slot.id : null,
        availability_id: type === 'individual' ? slot.id : null,
        payment_amount: pricing.studentAmount,
        payment_status: "pending",
        session_type: type,
        priority_level: "normal"
      };

      const { data: sessionRequest, error } = await supabase
        .from("session_requests")
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        sessionRequestId: sessionRequest.id,
        step: "payment"
      }));
    } catch (error) {
      console.error("Error creating session request:", error);
    }
  };

  const handlePaymentSuccess = () => {
    setState(prev => ({ ...prev, step: "request-form" }));
  };

  const handleBackToTeachers = () => {
    setState(prev => ({
      ...prev,
      step: "select-teacher",
      selectedTeacherId: "",
      selectedAvailability: null,
      sessionRequestId: ""
    }));
  };

  const handleBackToAvailability = () => {
    setState(prev => ({
      ...prev,
      step: "select-availability",
      selectedAvailability: null,
      sessionRequestId: ""
    }));
  };

  const calculateAmount = () => {
    if (!state.selectedAvailability) return 0;
    
    const teacherRate = state.availabilityType === 'individual' 
      ? (state.selectedAvailability.price || state.selectedAvailability.teacher_rate || 100)
      : (state.selectedAvailability.price || state.selectedAvailability.teacher_rate || 500);
    
    const pricing = calculatePricing(teacherRate);
    return pricing.studentAmount;
  };

  return {
    handleSelectTeacher,
    handleSelectSlot,
    handlePaymentSuccess,
    handleBackToTeachers,
    handleBackToAvailability,
    calculateAmount
  };
};
