
import { Session } from "@/hooks/types";

export const getStatusBadgeClass = (status: string) => {
  switch(status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'attended':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'missed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

export const getStatusText = (session: Session) => {
  // Use display_status if available, otherwise use status
  const statusToShow = session.display_status || session.status;
  
  switch(statusToShow) {
    case 'completed':
      return 'Completed';
    case 'attended':
      return 'Attended';
    case 'in_progress':
      return 'In Progress';
    case 'missed':
      return 'Missed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Upcoming';
  }
};
