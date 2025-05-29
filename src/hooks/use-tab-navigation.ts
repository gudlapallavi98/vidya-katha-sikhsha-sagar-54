
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useTabNavigation = (defaultTab: string = "overview") => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);

  useEffect(() => {
    // Update activeTab when URL changes
    if (tabFromUrl && tabFromUrl !== activeTab) {
      console.log("Tab from URL changed:", tabFromUrl);
      setActiveTab(tabFromUrl);
    } else if (!tabFromUrl && activeTab !== defaultTab) {
      // If no tab in URL, set to default
      console.log("No tab in URL, setting to default:", defaultTab);
      setActiveTab(defaultTab);
    }
  }, [tabFromUrl, defaultTab]);

  const handleTabChange = useCallback((tab: string) => {
    console.log("handleTabChange called with:", tab);
    
    // Prevent rapid tab switching
    if (tab === activeTab) {
      console.log("Tab already active, ignoring:", tab);
      return;
    }
    
    setActiveTab(tab);
    
    // Update URL immediately
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", tab);
    setSearchParams(newSearchParams, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  return { activeTab, handleTabChange };
};
