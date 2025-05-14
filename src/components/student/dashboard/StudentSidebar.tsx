
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";

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
            onClick={() => setActiveTab("overview")}
          >
            Dashboard
          </Button>
          <Button 
            variant={activeTab === "courses" ? "default" : "ghost"} 
            className={activeTab === "courses" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => setActiveTab("courses")}
          >
            My Courses
          </Button>
          <Button 
            variant={activeTab === "sessions" ? "default" : "ghost"} 
            className={activeTab === "sessions" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => setActiveTab("sessions")}
          >
            Upcoming Sessions
          </Button>
          <Button 
            variant={activeTab === "past-sessions" ? "default" : "ghost"} 
            className={activeTab === "past-sessions" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => setActiveTab("past-sessions")}
          >
            Past Sessions
          </Button>
          <Button 
            variant={activeTab === "request-session" ? "default" : "ghost"} 
            className={activeTab === "request-session" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => setActiveTab("request-session")}
          >
            Request Session
          </Button>
          <Button 
            variant={activeTab === "profile" ? "default" : "ghost"} 
            className={activeTab === "profile" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
            onClick={() => setActiveTab("profile")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
};

export default StudentSidebar;
