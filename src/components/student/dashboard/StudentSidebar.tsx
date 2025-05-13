
import React, { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firstName?: string;
  lastName?: string;
}

const StudentSidebar: React.FC<StudentSidebarProps> = React.memo(({
  activeTab,
  setActiveTab,
  firstName,
  lastName
}) => {
  // Memoize the tab click handler to prevent recreating function on every render
  const handleTabClick = useCallback((tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }, [activeTab, setActiveTab]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-indian-saffron/20 flex items-center justify-center">
            <User className="h-8 w-8 text-indian-saffron" />
          </div>
          <div>
            <CardTitle>{firstName || "Student"} {lastName || ""}</CardTitle>
            <CardDescription>Student</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          <Button 
            variant={activeTab === "overview" ? "default" : "ghost"} 
            className={activeTab === "overview" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => handleTabClick("overview")}
          >
            Dashboard
          </Button>
          <Button 
            variant={activeTab === "courses" ? "default" : "ghost"} 
            className={activeTab === "courses" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => handleTabClick("courses")}
          >
            My Courses
          </Button>
          <Button 
            variant={activeTab === "sessions" ? "default" : "ghost"} 
            className={activeTab === "sessions" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => handleTabClick("sessions")}
          >
            Upcoming Sessions
          </Button>
          <Button 
            variant={activeTab === "past-sessions" ? "default" : "ghost"} 
            className={activeTab === "past-sessions" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => handleTabClick("past-sessions")}
          >
            Past Sessions
          </Button>
          <Button 
            variant={activeTab === "request-session" ? "default" : "ghost"} 
            className={activeTab === "request-session" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => handleTabClick("request-session")}
          >
            Request Session
          </Button>
          <Button 
            variant={activeTab === "profile" ? "default" : "ghost"} 
            className={activeTab === "profile" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => handleTabClick("profile")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
});

StudentSidebar.displayName = "StudentSidebar";

export default StudentSidebar;
