// Fully Reviewed SessionRequestForm.tsx with Safe Test Slot Injection
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import SessionRequestList from "./SessionRequestList";
import AvailabilitySelector from "./availability/AvailabilitySelector";
import { CashfreePaymentForm } from "./payment/CashfreePaymentForm";
import { SessionRequestFormFields } from "./session/SessionRequestFormFields";
import { SessionRequestSteps } from "./session/SessionRequestSteps";
import { SessionRequestState, initialState } from "./session/SessionRequestState";
import { useSessionRequestHandlers } from "./session/SessionRequestHandlers";

interface SessionRequestFormProps {
  initialState?: {
    selectedTeacherId?: string;
    selectedCourse?: any;
    enrollmentMode?: boolean;
  };
}

const SessionRequestForm: React.FC<SessionRequestFormProps> = ({ initialState: propInitialState }) => {
  const [state, setState] = useState<SessionRequestState>(initialState);

  const {
    handleSelectTeacher,
    handleSelectSlot,
    handlePaymentSuccess,
    handleBackToTeachers,
    handleBackToAvailability,
    calculateAmount
  } = useSessionRequestHandlers(state, setState);

  // Temporary force step to select-availability for testing
  useEffect(() => {
    if (!state.step || state.step === "select-teacher") {
      setState(prev => ({
        ...prev,
        step: "select-availability"
      }));
    }
  }, []);

  // Handle initial state from navigation
  useEffect(() => {
    if (propInitialState?.selectedTeacherId) {
      console.log("Setting initial teacher:", propInitialState.selectedTeacherId);
      setState(prev => ({
        ...prev,
        selectedTeacherId: propInitialState.selectedTeacherId!
      }));

      if (propInitialState.enrollmentMode && propInitialState.selectedCourse) {
        console.log("Direct enrollment mode for course:", propInitialState.selectedCourse);
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

  console.log("Current state:", state);

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
        <>
          <AvailabilitySelector
            teacherId={state.selectedTeacherId}
            onSelectSlot={handleSelectSlot}
          />

          {/* ✅ Safe Test Button */}
          <button
            onClick={() => {
              const fakeSlot = {
                id: "test-slot-1",
                session_type: "individual",
                available_date: "2025-06-10",
                start_time: "10:00",
                end_time: "11:00",
                subject: { name: "Test Subject" },
                price: 200
              };
              console.log("Test button clicked: selecting fake slot");
              handleSelectSlot(fakeSlot);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            🧪 Test Slot Selection
          </button>
        </>
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
          teacherId={state.selectedTeacherId}
          availability={state.selectedAvailability}
          type={state.availabilityType}
          onBack={handleBackToAvailability}
          onSuccess={handleBackToTeachers}
        />
      )}
    </Card>
  );
};

export default SessionRequestForm;
