
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Clock, 
  MessageSquare,
  Video,
  Settings 
} from "lucide-react";

interface TeacherDashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherDashboardSidebar: React.FC<TeacherDashboardSidebarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const menuItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: LayoutDashboard 
    },
    { 
      id: "courses", 
      label: "Courses", 
      icon: BookOpen 
    },
    { 
      id: "schedule", 
      label: "Schedule", 
      icon: Calendar 
    },
    { 
      id: "availability", 
      label: "Availability", 
      icon: Clock 
    },
    { 
      id: "session-requests", 
      label: "Session Requests", 
      icon: MessageSquare 
    },
    { 
      id: "session-management", 
      label: "Session Management", 
      icon: Video 
    }
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <h2 className="text-lg font-semibold">Teacher Dashboard</h2>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`justify-start gap-3 ${
                    activeTab === item.id 
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardSidebar;
