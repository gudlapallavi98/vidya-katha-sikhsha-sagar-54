
import { useStudentEnrollments } from './student/use-student-enrollments';
import { useStudentProgress } from './student/use-student-progress';
import { useStudentAchievements } from './student/use-student-achievements';
import { useStudentUpcomingSessions, useStudentPastSessions } from './student/use-student-sessions';

/**
 * Custom hook to fetch all student dashboard data in one place
 * This centralizes the data fetching for better error handling and loading states
 */
export const useStudentDashboard = () => {
  // Use the individual hooks we've created
  const enrollments = useStudentEnrollments();
  const progress = useStudentProgress();
  const upcomingSessions = useStudentUpcomingSessions();
  const pastSessions = useStudentPastSessions();
  const achievements = useStudentAchievements();

  return {
    enrollments: {
      data: enrollments.data || [],
      isLoading: enrollments.isLoading,
      error: enrollments.error
    },
    progress: {
      data: progress.data || [],
      isLoading: progress.isLoading,
      error: progress.error
    },
    upcomingSessions: {
      data: upcomingSessions.data || [],
      isLoading: upcomingSessions.isLoading,
      error: upcomingSessions.error
    },
    pastSessions: {
      data: pastSessions.data || [],
      isLoading: pastSessions.isLoading,
      error: pastSessions.error
    },
    achievements: {
      data: achievements.data || [],
      isLoading: achievements.isLoading,
      error: achievements.error
    },
    isLoading: 
      enrollments.isLoading || 
      progress.isLoading || 
      upcomingSessions.isLoading || 
      pastSessions.isLoading || 
      achievements.isLoading,
    isError: 
      !!enrollments.error || 
      !!progress.error || 
      !!upcomingSessions.error || 
      !!pastSessions.error || 
      !!achievements.error
  };
};
