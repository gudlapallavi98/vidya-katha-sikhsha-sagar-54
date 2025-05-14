
import React from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar,
  Users,
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  collapsed
}) => {
  const { user } = useAuth();
  
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "sessions", label: "Session Requests", icon: Users },
    { id: "schedule", label: "My Schedule", icon: Calendar },
    { id: "availability", label: "Set Availability", icon: Calendar },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  return (
    <div className="h-full py-4">
      {/* Header/Profile section */}
      <div className={`flex ${collapsed ? "justify-center" : "px-4"} mb-6`}>
        {!collapsed ? (
          <div>
            <h3 className="font-medium">
              {user?.user_metadata?.first_name || "Teacher"}
            </h3>
            <p className="text-sm text-muted-foreground">Teacher</p>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-indian-blue/20 flex items-center justify-center">
            <span className="text-indian-blue font-bold">
              {user?.user_metadata?.first_name?.charAt(0) || "T"}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`
                    ${activeTab === item.id ? "bg-indian-blue" : ""} 
                    ${collapsed ? "justify-center w-12 px-0 mx-auto" : "justify-start w-full"}
                    h-10 mb-1
                  `}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-2"}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default React.memo(TeacherSidebar);
