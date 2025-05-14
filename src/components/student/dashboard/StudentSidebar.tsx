
import React from "react";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  History, 
  MessageSquare, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firstName?: string;
  lastName?: string;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  firstName,
  lastName
}) => {
  const navigationItems = [
    { 
      icon: Home, 
      label: "Overview", 
      value: "overview"
    },
    { 
      icon: BookOpen, 
      label: "My Courses", 
      value: "courses"
    },
    { 
      icon: Calendar, 
      label: "Upcoming Sessions", 
      value: "sessions"
    },
    { 
      icon: History, 
      label: "Past Sessions", 
      value: "past-sessions"
    },
    { 
      icon: MessageSquare, 
      label: "Request Session", 
      value: "request-session"
    },
    { 
      icon: Settings, 
      label: "Profile", 
      value: "profile"
    },
  ];

  const initials = firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'ST';

  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg border shadow-sm p-6 sticky top-20 mb-6 md:mb-0">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indian-blue to-indian-blue/60 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          {initials}
        </div>
        <h2 className="text-xl font-medium">{firstName} {lastName}</h2>
        <p className="text-muted-foreground text-sm mt-2 mb-6">
          Student Dashboard
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
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default StudentSidebar;
