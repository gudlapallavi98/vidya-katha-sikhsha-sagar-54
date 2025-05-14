
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useTabNavigation = (defaultTab: string = "overview") => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);

  useEffect(() => {
    // Only update activeTab if tabFromUrl changes and is not null
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Create a new URLSearchParams object based on the current params
    const newParams = new URLSearchParams(searchParams);
    // Update the tab parameter
    newParams.set("tab", tab);
    
    // Use React Router's navigate to update the URL without a full page reload
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  return { activeTab, handleTabChange };
};
