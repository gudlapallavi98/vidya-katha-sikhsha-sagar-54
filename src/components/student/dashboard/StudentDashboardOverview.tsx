
import { Session, Enrollment } from "@/hooks/types";
import StatCards from "./overview/StatCards";
import UpcomingSessionsList from "./overview/UpcomingSessionsList";
import RecentSessionsList from "./overview/RecentSessionsList";
import EnrolledCoursesList from "./overview/EnrolledCoursesList";

interface StudentDashboardOverviewProps {
  enrolledCourses: Enrollment[];
  upcomingSessionsList: Session[];
  completedSessionsList: Session[];
  coursesLoading: boolean;
  sessionsLoading: boolean;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (session: Session) => string;
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const StudentDashboardOverview: React.FC<StudentDashboardOverviewProps> = ({
  enrolledCourses,
  upcomingSessionsList,
  completedSessionsList,
  coursesLoading,
  sessionsLoading,
  getStatusBadgeClass,
  getStatusText,
  handleJoinClass
}) => {
  return (
    <>
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <StatCards
        enrolledCourses={enrolledCourses}
        upcomingSessionsList={upcomingSessionsList}
        completedSessionsList={completedSessionsList}
      />
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <UpcomingSessionsList 
          sessions={upcomingSessionsList}
          isLoading={sessionsLoading}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusText={getStatusText}
          handleJoinClass={handleJoinClass}
        />
        
        {completedSessionsList.length > 0 && (
          <RecentSessionsList
            sessions={completedSessionsList}
            getStatusBadgeClass={getStatusBadgeClass}
            getStatusText={getStatusText}
          />
        )}
        
        <EnrolledCoursesList
          enrolledCourses={enrolledCourses}
          isLoading={coursesLoading}
        />
      </div>
    </>
  );
};

export default StudentDashboardOverview;
