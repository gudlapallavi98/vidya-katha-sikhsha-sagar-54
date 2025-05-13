
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Custom hook to manage dashboard tab state with optimized navigation
 * preventing unnecessary reloads and re-renders
 */
export const useDashboardTabs = (defaultTab = "overview") => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  
  // Initialize with URL param if available, otherwise use default
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);

  // Sync state with URL params when the component mounts or URL changes directly
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    } else if (!currentTab && activeTab !== defaultTab) {
      // If no tab in URL but we have a default, set it without triggering reload
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [searchParams, activeTab, defaultTab, setSearchParams]);

  // Memoized tab change handler to prevent recreating function on every render
  const handleTabChange = useCallback((tab: string) => {
    if (tab === activeTab) return; // Prevent unnecessary updates
    
    // Update local state immediately for faster UI response
    setActiveTab(tab);
    
    // Critical: Use replace:true to prevent adding to browser history stack
    // and to avoid triggering full page reloads
    setSearchParams({ tab }, { replace: true });
  }, [activeTab, setSearchParams]);

  return {
    activeTab,
    handleTabChange
  };
};
