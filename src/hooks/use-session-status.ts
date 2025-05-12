
import { useAvailabilityManager } from "./use-availability-manager";
import { useSessionReminders } from "./use-session-reminders";
import { useSessionAcceptance } from "./use-session-acceptance";
import { useSessionStatusChange as ImportedSessionStatusChange } from "./use-session-status-change";

export const useSessionStatus = () => {
  const { cancelExpiredAvailabilities } = useAvailabilityManager();
  const { checkUpcomingSessionReminders } = useSessionReminders();
  const { handleSessionAccepted } = useSessionAcceptance();
  const { handleStatusChange } = ImportedSessionStatusChange();

  return {
    cancelExpiredAvailabilities,
    checkUpcomingSessionReminders,
    handleSessionAccepted,
    handleStatusChange
  };
};
