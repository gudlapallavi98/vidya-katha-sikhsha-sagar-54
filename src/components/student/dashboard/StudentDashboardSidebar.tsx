
import React from "react";
import { Settings, BookOpen, Calendar, Video } from "lucide-react";
import DashboardSidebar, { SidebarItem } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface StudentDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentDashboardSidebar: React.FC<StudentDashboardSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  
  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Dashboard", icon: null },
    { id: "courses", label: "My Courses", icon: <BookOpen className="h-4 w-4" /> },
    { id: "sessions", label: "Upcoming Sessions", icon: <Video className="h-4 w-4" /> },
    { id: "request-session", label: "Request Session", icon: <Calendar className="h-4 w-4" /> },
    { id: "profile", label: "Profile Settings", icon: <Settings className="h-4 w-4" /> }
  ];
  
  return (
    <DashboardSidebar
      title={`${user?.user_metadata?.first_name || ""} ${user?.user_metadata?.last_name || ""}`}
      subtitle="Student"
      userName={`${user?.user_metadata?.first_name || "Student"} ${user?.user_metadata?.last_name || ""}`}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      items={sidebarItems}
      accentColor="indian-saffron"
    />
  );
};

export default StudentDashboardSidebar;
