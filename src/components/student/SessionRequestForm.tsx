
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import SessionRequestList from "./SessionRequestList";
import AvailabilitySelector from "./availability/AvailabilitySelector";
import { CashfreePaymentForm } from "./payment/CashfreePaymentForm";
import { SessionRequestFormFields } from "./session/SessionRequestFormFields";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculatePricing } from "@/utils/pricingUtils";

interface SessionRequestFormProps {
  initialState?: {
    selectedTeacherId?: string;
    selectedCourse?: any;
    enrollmentMode?: boolean;
  };
}

const SessionRequestForm: React.FC<SessionRequestFormProps> = ({ initialState }) => {
  const [step, setStep] = useState<"select-teacher" | "select-availability" | "payment" | "request-form">("select-teacher");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<any>(null);
  const [availabilityType, setAvailabilityType] = useState<'individual' | 'course'>('individual');
  const [sessionRequestId, setSessionRequestId] = useState<string>("");
  const { user } = useAuth();

  // Handle initial state from navigation
  useEffect(() => {
    if (initialState?.selectedTeacherId) {
      setSelectedTeacherId(initialState.selectedTeacherId);
      if (initialState.enrollmentMode && initialState.selectedCourse) {
        setSelectedAvailability(initialState.selectedCourse);
        setAvailabilityType('course');
        setStep("payment");
      } else {
        setStep("select-availability");
      }
    }
  }, [initialState]);

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setStep("select-availability");
  };

  const calculateDurationFromTimeSlot = (startTime: string, endTime: string): number => {
    try {
      // Convert time strings to Date objects for calculation
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      
      // Calculate difference in milliseconds and convert to minutes
      const durationMs = end.getTime() - start.getTime();
      return Math.floor(durationMs / (1000 * 60));
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 60; // Default to 60 minutes if calculation fails
    }
  };

  const handleSelectSlot = async (slot: any) => {
    if (!user) return;

    setSelectedAvailability(slot);
    const type = slot.session_type === 'individual' ? 'individual' : 'course';
    setAvailabilityType(type);

    try {
      // Create session request first (pending payment)
      const teacherRate = type === 'individual' 
        ? (slot.price || slot.teacher_rate || 100)
        : (slot.price || slot.teacher_rate || 500);
      
      const pricing = calculatePricing(teacherRate);

      // Format date and time for database storage
      const proposedDate = type === 'individual' && slot.available_date && slot.start_time
        ? new Date(`${slot.available_date}T${slot.start_time}:00`).toISOString()
        : new Date().toISOString();

      // Calculate duration properly for individual sessions
      const proposedDuration = type === 'individual' && slot.start_time && slot.end_time
        ? calculateDurationFromTimeSlot(slot.start_time, slot.end_time)
        : 60;

      const sessionData = {
        student_id: user.id,
        teacher_id: selectedTeacherId,
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

      setSessionRequestId(sessionRequest.id);
      setStep("payment");
    } catch (error) {
      console.error("Error creating session request:", error);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("request-form");
  };

  const handleBackToTeachers = () => {
    setStep("select-teacher");
    setSelectedTeacherId("");
    setSelectedAvailability(null);
    setSessionRequestId("");
  };

  const handleBackToAvailability = () => {
    setStep("select-availability");
    setSelectedAvailability(null);
    setSessionRequestId("");
  };

  const calculateAmount = () => {
    if (!selectedAvailability) return 0;
    
    const teacherRate = availabilityType === 'individual' 
      ? (selectedAvailability.price || selectedAvailability.teacher_rate || 100)
      : (selectedAvailability.price || selectedAvailability.teacher_rate || 500);
    
    const pricing = calculatePricing(teacherRate);
    return pricing.studentAmount;
  };

  return (
    <Card className="p-6">
      {step === "select-teacher" && !initialState?.selectedTeacherId && (
        <SessionRequestList onSelectTeacher={handleSelectTeacher} />
      )}
      
      {step === "select-availability" && (
        <AvailabilitySelector
          teacherId={selectedTeacherId}
          onSelectSlot={handleSelectSlot}
        />
      )}
      
      {step === "payment" && selectedAvailability && sessionRequestId && (
        <CashfreePaymentForm
          availability={selectedAvailability}
          type={availabilityType}
          sessionRequestId={sessionRequestId}
          amount={calculateAmount()}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={handleBackToAvailability}
        />
      )}
      
      {step === "request-form" && selectedAvailability && (
        <SessionRequestFormFields
          teacherId={selectedTeacherId}
          availability={selectedAvailability}
          type={availabilityType}
          onBack={handleBackToAvailability}
          onSuccess={handleBackToTeachers}
        />
      )}
    </Card>
  );
};

export default SessionRequestForm;
