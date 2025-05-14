
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing dashboard tab state and URL synchronization
 * Works for both teacher and student dashboards
 */
export const useDashboardTabs = (defaultTab: string = "overview") => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract current tab from URL if present
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || defaultTab;
  };
  
  // Initialize tab state from URL
  const [activeTab, setActiveTab] = useState<string>(getTabFromUrl());
  
  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };
  
  // Sync with URL changes (e.g., from browser navigation)
  useEffect(() => {
    const currentTab = getTabFromUrl();
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.search]);
  
  return { activeTab, handleTabChange };
};
