
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import SessionRequestList from "./SessionRequestList";
import { AvailabilitySelector } from "./availability/AvailabilitySelector";
import { PaymentQRGenerator } from "./payment/PaymentQRGenerator";
import { SessionRequestFormFields } from "./session/SessionRequestFormFields";

const SessionRequestForm = () => {
  const [step, setStep] = useState<"select-teacher" | "select-availability" | "payment" | "request-form">("select-teacher");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<any>(null);
  const [availabilityType, setAvailabilityType] = useState<'individual' | 'course'>('individual');

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setStep("select-availability");
  };

  const handleSelectAvailability = (availability: any, type: 'individual' | 'course') => {
    setSelectedAvailability(availability);
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
      {step === "select-teacher" && (
        <SessionRequestList onSelectTeacher={handleSelectTeacher} />
      )}
      
      {step === "select-availability" && (
        <AvailabilitySelector
          teacherId={selectedTeacherId}
          onSelectAvailability={handleSelectAvailability}
          onBack={handleBackToTeachers}
        />
      )}
      
      {step === "payment" && selectedAvailability && (
        <PaymentQRGenerator
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
