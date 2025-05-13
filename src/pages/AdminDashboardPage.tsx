
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminOverview from "@/components/admin/dashboard/AdminOverview";
import AdminUsersManagement from "@/components/admin/dashboard/AdminUsersManagement";
import AdminCoursesManagement from "@/components/admin/dashboard/AdminCoursesManagement";
import AdminSessionsManagement from "@/components/admin/dashboard/AdminSessionsManagement";
import AdminRequestsManagement from "@/components/admin/dashboard/AdminRequestsManagement";
import AdminSettings from "@/components/admin/dashboard/AdminSettings";

// Create a client
const queryClient = new QueryClient();

// Wrapper component to provide React Query context
const AdminDashboardWithQueryClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminDashboard />
    </QueryClientProvider>
  );
};

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Function to handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <AdminSidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
            firstName={user?.user_metadata?.first_name}
            lastName={user?.user_metadata?.last_name}
          />
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsContent value="overview" className="m-0">
              <AdminOverview />
            </TabsContent>
            
            <TabsContent value="users" className="m-0">
              <AdminUsersManagement />
            </TabsContent>
            
            <TabsContent value="courses" className="m-0">
              <AdminCoursesManagement />
            </TabsContent>
            
            <TabsContent value="sessions" className="m-0">
              <AdminSessionsManagement />
            </TabsContent>
            
            <TabsContent value="requests" className="m-0">
              <AdminRequestsManagement />
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardWithQueryClient;
