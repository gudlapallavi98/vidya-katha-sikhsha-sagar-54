
import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook to manage sidebar collapsed state with persistence
 */
export const useSidebarState = () => {
  // Get initial state from localStorage if available
  const getInitialState = () => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState !== null ? JSON.parse(savedState) : false;
  };

  const [collapsed, setCollapsed] = useState(getInitialState);

  // Toggle sidebar state
  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  return { collapsed, toggleSidebar };
};
