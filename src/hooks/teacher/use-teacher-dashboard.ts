
import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Custom hook to manage teacher dashboard tab state
 * This centralizes tab management logic and prevents unnecessary re-renders
 */
export const useTeacherDashboard = (defaultTab = "overview") => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);

  // Memoized tab change handler to prevent recreating function on every render
  const handleTabChange = useCallback((tab: string) => {
    if (tab === activeTab) return; // Prevent unnecessary updates
    
    setActiveTab(tab);
    
    // Using { replace: true } is critical to prevent page reloads
    // This replaces the current history state instead of adding a new one
    setSearchParams({ tab }, { replace: true });
  }, [activeTab, setSearchParams]);

  return {
    activeTab,
    handleTabChange
  };
};
