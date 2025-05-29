
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  DollarSign,
  Clock,
  Settings 
} from "lucide-react";

interface TeacherDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherDashboardSidebar: React.FC<TeacherDashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "requests", label: "Session Requests", icon: MessageSquare },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    console.log("TeacherDashboard: Switching to tab:", tabId);
    // Force the tab change
    setActiveTab(tabId);
    
    // Also update URL to reflect the change
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
                onClick={() => handleTabClick(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherDashboardSidebar;
