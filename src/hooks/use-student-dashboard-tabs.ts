
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Custom hook to manage student dashboard tab state
 * This centralizes tab management logic and prevents unnecessary re-renders
 */
export const useStudentDashboardTabs = (defaultTab = "overview") => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);

  // Sync state with URL params on mount and when URL changes
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams, activeTab]);

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
