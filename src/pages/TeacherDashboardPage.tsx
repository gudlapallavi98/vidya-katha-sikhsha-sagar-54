
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeacherDashboardMain from "@/components/teacher/dashboard/TeacherDashboardMain";

// Create a client
const queryClient = new QueryClient();

// Wrapper component to provide React Query context
const TeacherDashboardWithQueryClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TeacherDashboard />
    </QueryClientProvider>
  );
};

const TeacherDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  
  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <TeacherDashboardMain 
      queryClient={queryClient}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

export default TeacherDashboardWithQueryClient;
