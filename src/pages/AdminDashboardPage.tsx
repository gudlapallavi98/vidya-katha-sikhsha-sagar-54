
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminOverview from "@/components/admin/dashboard/AdminOverview";
import AdminUsersManagement from "@/components/admin/dashboard/AdminUsersManagement";
import AdminCoursesManagement from "@/components/admin/dashboard/AdminCoursesManagement";
import AdminSessionsManagement from "@/components/admin/dashboard/AdminSessionsManagement";
import AdminRequestsManagement from "@/components/admin/dashboard/AdminRequestsManagement";
import AdminSettings from "@/components/admin/dashboard/AdminSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";

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
  // Use our unified dashboard tabs hook
  const { activeTab, handleTabChange } = useDashboardTabs("overview");
  const { user } = useAuth();
  const { toast } = useToast();

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
          <Tabs value={activeTab} className="w-full">
            {/* Hidden TabsList - critical for Radix UI's internal state management */}
            <TabsList className="hidden">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="requests">Session Requests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="m-0 focus:outline-none">
              <AdminOverview />
            </TabsContent>
            
            <TabsContent value="users" className="m-0 focus:outline-none">
              <AdminUsersManagement />
            </TabsContent>
            
            <TabsContent value="courses" className="m-0 focus:outline-none">
              <AdminCoursesManagement />
            </TabsContent>
            
            <TabsContent value="sessions" className="m-0 focus:outline-none">
              <AdminSessionsManagement />
            </TabsContent>
            
            <TabsContent value="requests" className="m-0 focus:outline-none">
              <AdminRequestsManagement />
            </TabsContent>
            
            <TabsContent value="settings" className="m-0 focus:outline-none">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardWithQueryClient;
