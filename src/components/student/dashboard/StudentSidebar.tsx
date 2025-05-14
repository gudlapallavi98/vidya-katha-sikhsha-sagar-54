
import React from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar,
  Clock,
  Users,
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firstName?: string;
  lastName?: string;
  collapsed: boolean;
}

const StudentSidebar: React.FC<StudentSidebarProps> = React.memo(({
  activeTab,
  setActiveTab,
  firstName,
  lastName,
  collapsed
}) => {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "sessions", label: "Upcoming Sessions", icon: Calendar },
    { id: "past-sessions", label: "Past Sessions", icon: Clock },
    { id: "request-session", label: "Request Session", icon: Users },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  return (
    <div className="h-full py-4">
      {/* Header/Profile section */}
      <div className={`flex ${collapsed ? "justify-center" : "px-4"} mb-6`}>
        {!collapsed ? (
          <div>
            <h3 className="font-medium">
              {firstName || "Student"} {!collapsed && lastName}
            </h3>
            <p className="text-sm text-muted-foreground">Student</p>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-indian-saffron/20 flex items-center justify-center">
            <span className="text-indian-saffron font-bold">
              {firstName?.charAt(0) || "S"}
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
                    ${activeTab === item.id ? "bg-indian-saffron" : ""} 
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
});

StudentSidebar.displayName = "StudentSidebar";

export default StudentSidebar;
