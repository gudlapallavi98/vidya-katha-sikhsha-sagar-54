import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import SessionRequestList from "./SessionRequestList";
import AvailabilitySelector from "./availability/AvailabilitySelector";
import { SimplePaymentForm } from "./payment/SimplePaymentForm";
import { SessionRequestFormFields } from "./session/SessionRequestFormFields";

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

  const handleSelectSlot = (slot: any) => {
    setSelectedAvailability(slot);
    // Determine type based on slot properties
    const type = slot.session_type === 'individual' ? 'individual' : 'course';
    setAvailabilityType(type);
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("request-form");
  };

  const handleBackToTeachers = () => {
    setStep("select-teacher");
    setSelectedTeacherId("");
    setSelectedAvailability(null);
  };

  const handleBackToAvailability = () => {
    setStep("select-availability");
    setSelectedAvailability(null);
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
      
      {step === "payment" && selectedAvailability && (
        <SimplePaymentForm
          availability={selectedAvailability}
          type={availabilityType}
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
