// Updated SessionRequestForm.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import SessionRequestList from "./SessionRequestList";
import AvailabilitySelector from "./availability/AvailabilitySelector";
import { CashfreePaymentForm } from "./payment/CashfreePaymentForm";
import { SessionRequestFormFields } from "./session/SessionRequestFormFields";
import { SessionRequestSteps } from "./session/SessionRequestSteps";
import { SessionRequestState, initialState } from "./session/SessionRequestState";
import { useSessionRequestHandlers } from "./session/SessionRequestHandlers";
import { supabase } from "@/integrations/supabase/client";

const fetchTeacherById = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      name,
      email,
      rate,
      role
    `)
    .eq("id", id)
    .eq("role", "teacher")
    .single();

  if (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }

  return data;
};

interface SessionRequestFormProps {
  initialState?: {
    selectedTeacherId?: string;
    selectedCourse?: any;
    enrollmentMode?: boolean;
  };
}

const SessionRequestForm: React.FC<SessionRequestFormProps> = ({ initialState: propInitialState }) => {
  const [state, setState] = useState<SessionRequestState>(initialState);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm();

  const {
    handleSelectTeacher,
    handleSelectSlot,
    handlePaymentSuccess,
    handleBackToTeachers,
    handleBackToAvailability,
    calculateAmount
  } = useSessionRequestHandlers(state, setState);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (state.selectedTeacherId) {
        const teacher = await fetchTeacherById(state.selectedTeacherId);
        setSelectedTeacher(teacher);
      }
    };
    fetchTeacher();
  }, [state.selectedTeacherId]);

  useEffect(() => {
    if (propInitialState?.selectedTeacherId) {
      setState(prev => ({
        ...prev,
        selectedTeacherId: propInitialState.selectedTeacherId!
      }));

      if (propInitialState.enrollmentMode && propInitialState.selectedCourse) {
        setState(prev => ({
          ...prev,
          selectedAvailability: propInitialState.selectedCourse,
          availabilityType: 'course',
          step: "payment"
        }));
      } else {
        setState(prev => ({ ...prev, step: "select-availability" }));
      }
    }
  }, [propInitialState]);

  const handleBookSession = async () => {
    if (!state.selectedAvailability) return;
    setIsLoading(true);
    try {
      console.log("Booking session:", state.selectedAvailability);
      // TODO: Add booking API call
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <SessionRequestSteps
        step={state.step}
        onBackToTeachers={handleBackToTeachers}
        onBackToAvailability={handleBackToAvailability}
      />

      {state.step === "select-teacher" && !propInitialState?.selectedTeacherId && (
        <SessionRequestList onSelectTeacher={handleSelectTeacher} />
      )}

      {state.step === "select-availability" && (
        <AvailabilitySelector
          teacherId={state.selectedTeacherId}
          onSelectSlot={handleSelectSlot}
        />
      )}

      {state.step === "payment" && state.selectedAvailability && state.sessionRequestId && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Required</h3>
          <p className="text-sm text-gray-600 mb-4">
            Session: {state.selectedAvailability.title || state.selectedAvailability.subject?.name || 'Session'}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Amount: ₹{calculateAmount()}
          </p>
          <CashfreePaymentForm
            availability={state.selectedAvailability}
            type={state.availabilityType}
            sessionRequestId={state.sessionRequestId}
            amount={calculateAmount()}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handleBackToAvailability}
          />
        </div>
      )}

      {state.step === "request-form" && state.selectedAvailability && (
        <SessionRequestFormFields
          form={form}
          selectedTeacher={selectedTeacher}
          selectedAvailability={state.selectedAvailability}
          onAvailabilitySelect={handleSelectSlot}
          onBookSession={handleBookSession}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
};

export default SessionRequestForm;
