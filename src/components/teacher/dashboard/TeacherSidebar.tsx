
import React, { useCallback } from "react";
import { Calendar, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = React.memo(({ 
  activeTab, 
  setActiveTab 
}) => {
  const { user } = useAuth();

  // Individual button handlers to prevent unnecessary re-renders
  const handleOverviewClick = useCallback(() => {
    if (activeTab !== "overview") setActiveTab("overview");
  }, [activeTab, setActiveTab]);

  const handleCoursesClick = useCallback(() => {
    if (activeTab !== "courses") setActiveTab("courses");
  }, [activeTab, setActiveTab]);

  const handleSessionsClick = useCallback(() => {
    if (activeTab !== "sessions") setActiveTab("sessions");
  }, [activeTab, setActiveTab]);

  const handleScheduleClick = useCallback(() => {
    if (activeTab !== "schedule") setActiveTab("schedule");
  }, [activeTab, setActiveTab]);

  const handleAvailabilityClick = useCallback(() => {
    if (activeTab !== "availability") setActiveTab("availability");
  }, [activeTab, setActiveTab]);

  const handleProfileClick = useCallback(() => {
    if (activeTab !== "profile") setActiveTab("profile");
  }, [activeTab, setActiveTab]);

  return (
    <div className="w-full md:w-1/4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-indian-blue/20 flex items-center justify-center">
              <User className="h-8 w-8 text-indian-blue" />
            </div>
            <div>
              <CardTitle>{user?.user_metadata?.first_name || "Teacher"} {user?.user_metadata?.last_name || ""}</CardTitle>
              <CardDescription>Teacher</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className={activeTab === "overview" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
              onClick={handleOverviewClick}
            >
              Dashboard
            </Button>
            <Button 
              variant={activeTab === "courses" ? "default" : "ghost"} 
              className={activeTab === "courses" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
              onClick={handleCoursesClick}
            >
              My Courses
            </Button>
            <Button 
              variant={activeTab === "sessions" ? "default" : "ghost"} 
              className={activeTab === "sessions" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
              onClick={handleSessionsClick}
            >
              Session Requests
            </Button>
            <Button 
              variant={activeTab === "schedule" ? "default" : "ghost"} 
              className={activeTab === "schedule" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
              onClick={handleScheduleClick}
            >
              My Schedule
            </Button>
            <Button 
              variant={activeTab === "availability" ? "default" : "ghost"} 
              className={activeTab === "availability" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
              onClick={handleAvailabilityClick}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Set Availability
            </Button>
            <Button 
              variant={activeTab === "profile" ? "default" : "ghost"} 
              className={activeTab === "profile" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
              onClick={handleProfileClick}
            >
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Button>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
});

TeacherSidebar.displayName = "TeacherSidebar";

export default TeacherSidebar;
