
import React from "react";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Settings 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    { 
      icon: Home, 
      label: "Overview", 
      value: "overview"
    },
    { 
      icon: BookOpen, 
      label: "Courses", 
      value: "courses"
    },
    { 
      icon: Calendar, 
      label: "Session Requests", 
      value: "sessions"
    },
    { 
      icon: Clock, 
      label: "Schedule", 
      value: "schedule"
    },
    { 
      icon: MessageSquare, 
      label: "Availability", 
      value: "availability"
    },
    { 
      icon: Settings, 
      label: "Profile", 
      value: "profile"
    },
  ];

  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg border shadow-sm p-6 sticky top-20 mb-6 md:mb-0">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indian-blue to-indian-blue/60 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          TE
        </div>
        <h2 className="text-xl font-medium">Teacher</h2>
        <p className="text-muted-foreground text-sm mt-2 mb-6">
          Dashboard Navigation
        </p>
      </div>
      
      {/* Navigation Menu */}
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.value;
          
          return (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-gradient-to-br from-indian-blue/20 to-indian-blue/10 text-indian-blue" 
                  : "text-gray-600 hover:text-indian-blue hover:bg-indian-blue/10"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-indian-blue" : ""
              )} />
              <span>{item.label}</span>
              {item.value === "sessions" && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
                  New
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TeacherSidebar;
