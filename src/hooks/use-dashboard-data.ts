
// This file now serves as a re-export of all hooks from specialized files
// This ensures backward compatibility for existing imports
export * from './types';
export * from './use-student-data';
export * from './use-teacher-data';
export * from './use-profile-data';

// Export the student-specific hooks with aliases to match what StudentDashboardPage expects
import { useStudentEnrollments, useStudentUpcomingSessions } from './use-student-data';
export const useStudentCourses = useStudentEnrollments;
export const useStudentSessions = useStudentUpcomingSessions;
