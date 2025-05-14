
import { useState, useCallback } from "react";
import { useDashboardTabs } from "../use-dashboard-tabs";
import { useTeacherCourses } from "./use-teacher-data";
import { useSessionRequests, useTeacherSessions } from "./use-teacher-sessions";

/**
 * Custom hook to centralize teacher dashboard data and state management
 */
export const useTeacherDashboard = () => {
  // Using the tabs hook with proper default tab
  const { activeTab, handleTabChange } = useDashboardTabs("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Get all teacher data
  const teacherCourses = useTeacherCourses();
  const sessionRequests = useSessionRequests(searchQuery);
  const teacherSessions = useTeacherSessions();

  // Calculate metrics from sessions data
  const upcomingSessions = teacherSessions.data?.filter(s => {
    const sessionEndTime = new Date(s.end_time);
    const now = new Date();
    return s.status === 'scheduled' || s.status === 'in_progress' || sessionEndTime >= now;
  }) || [];
  
  const totalSessions = {
    completed: (teacherSessions.data?.filter(s => s.status === 'completed') || []).length,
    upcoming: upcomingSessions.length
  };

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    activeTab,
    handleTabChange,
    searchQuery,
    handleSearch,
    teacherCourses,
    sessionRequests,
    teacherSessions,
    upcomingSessions,
    totalSessions
  };
};
