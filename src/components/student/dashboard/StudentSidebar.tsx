import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, GraduationCap, Calendar, Clock, MessageSquare, Settings } from "lucide-react";

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
  lastName,
}) => {
  const handleTabClick = (tab: string, event: React.MouseEvent) => {
    // Prevent default to avoid full page navigation
    event.preventDefault();
    setActiveTab(tab);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-20">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indian-saffron to-indian-saffron/60 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          {firstName && lastName
            ? `${firstName.charAt(0)}${lastName.charAt(0)}`
            : "ST"}
        </div>
        <h2 className="text-xl font-medium">
          {firstName && lastName ? `${firstName} ${lastName}` : "Student"}
        </h2>
      </div>

      <nav className="space-y-1">
        <TabsList className="flex flex-col w-full space-y-1 bg-transparent">
          <TabsTrigger
            value="overview"
            className={`w-full justify-start ${
              activeTab === "overview"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("overview", e)}
          >
            <User className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          
          <TabsTrigger
            value="courses"
            className={`w-full justify-start ${
              activeTab === "courses"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("courses", e)}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            My Courses
          </TabsTrigger>
          
          <TabsTrigger
            value="sessions"
            className={`w-full justify-start ${
              activeTab === "sessions"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("sessions", e)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Sessions
          </TabsTrigger>
          
          <TabsTrigger
            value="past-sessions"
            className={`w-full justify-start ${
              activeTab === "past-sessions"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("past-sessions", e)}
          >
            <Clock className="mr-2 h-4 w-4" />
            Past Sessions
          </TabsTrigger>
          
          <TabsTrigger
            value="request-session"
            className={`w-full justify-start ${
              activeTab === "request-session"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("request-session", e)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Request a Session
          </TabsTrigger>
          
          <TabsTrigger
            value="profile"
            className={`w-full justify-start ${
              activeTab === "profile"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("profile", e)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </TabsTrigger>
        </TabsList>
      </nav>
    </div>
  );
};

export default StudentSidebar;
