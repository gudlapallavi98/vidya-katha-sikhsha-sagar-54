
import React from "react";
import { Settings, Calendar, User } from "lucide-react";
import DashboardSidebar, { SidebarItem } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface TeacherDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherDashboardSidebar: React.FC<TeacherDashboardSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Dashboard", icon: null },
    { id: "courses", label: "My Courses", icon: null },
    { id: "sessions", label: "Session Requests", icon: null },
    { id: "schedule", label: "My Schedule", icon: null },
    { id: "availability", label: "Set Availability", icon: <Calendar className="h-4 w-4" /> },
    { id: "profile", label: "Profile Settings", icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <DashboardSidebar
      title={`${user?.user_metadata?.first_name || ""} ${user?.user_metadata?.last_name || ""}`}
      subtitle="Teacher"
      userName={`${user?.user_metadata?.first_name || "Teacher"} ${user?.user_metadata?.last_name || ""}`}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      items={sidebarItems}
      accentColor="indian-blue"
    />
  );
};

export default TeacherDashboardSidebar;
