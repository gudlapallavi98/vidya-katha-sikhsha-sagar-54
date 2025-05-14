
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Graduation, 
  Calendar, 
  Inbox, 
  Clock, 
  Settings 
} from "lucide-react";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherSidebar = ({ activeTab, setActiveTab }: TeacherSidebarProps) => {
  const handleTabClick = (tab: string, event: React.MouseEvent) => {
    // Prevent default to avoid full page navigation
    event.preventDefault();
    setActiveTab(tab);
  };

  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg border shadow-sm p-6 sticky top-20 mb-6 md:mb-0">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indian-blue to-indian-blue/60 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          TE
        </div>
        <h2 className="text-xl font-medium">Teacher</h2>
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
            <Graduation className="mr-2 h-4 w-4" />
            My Courses
          </TabsTrigger>
          
          <TabsTrigger
            value="session-requests"
            className={`w-full justify-start ${
              activeTab === "session-requests"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("session-requests", e)}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Session Requests
          </TabsTrigger>
          
          <TabsTrigger
            value="schedule"
            className={`w-full justify-start ${
              activeTab === "schedule"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("schedule", e)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            My Schedule
          </TabsTrigger>
          
          <TabsTrigger
            value="availability"
            className={`w-full justify-start ${
              activeTab === "availability"
                ? "bg-muted text-primary"
                : "hover:bg-muted/50"
            }`}
            onClick={(e) => handleTabClick("availability", e)}
          >
            <Clock className="mr-2 h-4 w-4" />
            Set Availability
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

export default TeacherSidebar;
