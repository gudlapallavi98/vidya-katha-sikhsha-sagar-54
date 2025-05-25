
import React from "react";
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSchedule from "./TeacherSchedule";
import TeacherSessionRequests from "./TeacherSessionRequests";
import SessionManagement from "./components/SessionManagement";
import EnhancedAvailabilityScheduler from "../availability/EnhancedAvailabilityScheduler";

interface TeacherDashboardContentProps {
  activeTab: string;
}

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <TeacherOverview />;
      case "courses":
        return <TeacherCourses />;
      case "schedule":
        return <TeacherSchedule />;
      case "availability":
        return <EnhancedAvailabilityScheduler />;
      case "session-requests":
        return <TeacherSessionRequests />;
      case "session-management":
        return <SessionManagement />;
      default:
        return <TeacherOverview />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {renderContent()}
    </div>
  );
};

export default TeacherDashboardContent;
