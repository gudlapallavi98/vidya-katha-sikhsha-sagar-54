
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SessionRequestStepsProps {
  step: "select-teacher" | "select-availability" | "payment" | "request-form";
  onBackToTeachers: () => void;
  onBackToAvailability: () => void;
}

export const SessionRequestSteps: React.FC<SessionRequestStepsProps> = ({
  step,
  onBackToTeachers,
  onBackToAvailability,
}) => {
  const getStepTitle = () => {
    switch (step) {
      case "select-teacher":
        return "Select Teacher";
      case "select-availability":
        return "Select Session";
      case "payment":
        return "Payment";
      case "request-form":
        return "Complete Request";
      default:
        return "";
    }
  };

  const showBackButton = step !== "select-teacher";
  const handleBack = () => {
    if (step === "select-availability") {
      onBackToTeachers();
    } else {
      onBackToAvailability();
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
      {showBackButton && (
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
    </div>
  );
};
