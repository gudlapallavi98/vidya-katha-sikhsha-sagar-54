
import { useAvailabilityManager } from "./use-availability-manager";
import { useSessionReminders } from "./use-session-reminders";
import { useSessionAcceptance } from "./use-session-acceptance";
import { useSessionStatusChange } from "./use-session-status-change";

export const useSessionStatus = () => {
  const { cancelExpiredAvailabilities } = useAvailabilityManager();
  const { checkUpcomingSessionReminders } = useSessionReminders();
  const { handleSessionAccepted } = useSessionAcceptance();
  const { handleStatusChange } = useSessionStatusChange();

  return {
    cancelExpiredAvailabilities,
    checkUpcomingSessionReminders,
    handleSessionAccepted,
    handleStatusChange
  };
};

// Export a named hook that matches what's being imported in TeacherSessionRequests.tsx
export const useSessionStatusChange = () => {
  const { handleStatusChange } = useSessionStatus();
  return { handleStatusChange };
};
