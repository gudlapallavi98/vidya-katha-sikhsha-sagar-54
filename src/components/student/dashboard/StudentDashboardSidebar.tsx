
import React from "react";
import { BookOpen, Calendar, Settings, Video, GraduationCap } from "lucide-react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import ProfileCard from "@/components/dashboard/ProfileCard";

interface StudentDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentDashboardSidebar: React.FC<StudentDashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "courses", label: "My Courses", icon: <BookOpen className="h-4 w-4" /> },
    { id: "sessions", label: "Upcoming Sessions", icon: <Video className="h-4 w-4" /> },
    { id: "request-session", label: "Request Session", icon: <Calendar className="h-4 w-4" /> },
    { id: "profile", label: "Profile Settings", icon: <Settings className="h-4 w-4" /> }
  ];
  
  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="space-y-2">
        <ProfileCard role="student" />
      </div>
      <div className="flex-1">
        <DashboardNav
          items={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default StudentDashboardSidebar;
