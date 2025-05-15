
import React from "react";
import { Layout, BookOpen, Calendar, Clock, Users, Settings } from "lucide-react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import ProfileCard from "@/components/dashboard/ProfileCard";

interface TeacherDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherDashboardSidebar: React.FC<TeacherDashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: <Layout className="h-4 w-4" /> },
    { id: "courses", label: "My Courses", icon: <BookOpen className="h-4 w-4" /> },
    { id: "sessions", label: "Session Requests", icon: <Users className="h-4 w-4" /> },
    { id: "schedule", label: "My Schedule", icon: <Calendar className="h-4 w-4" /> },
    { id: "profile", label: "Profile Settings", icon: <Settings className="h-4 w-4" /> }
  ];
  
  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="space-y-2">
        <ProfileCard role="teacher" />
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

export default TeacherDashboardSidebar;
