
export interface SessionRequestState {
  step: "select-teacher" | "select-availability" | "payment" | "request-form";
  selectedTeacherId: string;
  selectedAvailability: any;
  availabilityType: 'individual' | 'course';
  sessionRequestId: string;
}

export const initialState: SessionRequestState = {
  step: "select-teacher",
  selectedTeacherId: "",
  selectedAvailability: null,
  availabilityType: 'individual',
  sessionRequestId: "",
};
