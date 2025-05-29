
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CreditCard,
  Settings 
} from "lucide-react";

interface StudentDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentDashboardSidebar: React.FC<StudentDashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "sessions", label: "Sessions", icon: Calendar },
    { id: "payments", label: "Payment History", icon: CreditCard },
    { id: "request-session", label: "Request Session", icon: MessageSquare },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    console.log("StudentDashboard: Switching to tab:", tabId);
    setActiveTab(tabId);
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

export default StudentDashboardSidebar;
