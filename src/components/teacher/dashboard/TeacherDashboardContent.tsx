import React from "react";
import { BookOpen, Calendar, Clock, Users, Video, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatsCard from "@/components/dashboard/StatsCard";
import StatsContainer from "@/components/dashboard/StatsContainer";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import AvailabilityScheduler from "@/components/teacher/AvailabilityScheduler";
import { SessionRequest, Session } from "@/hooks/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeacherDashboardContentProps {
  activeTab: string;
  teacherCourses: any[];
  coursesLoading: boolean;
  sessionRequests: SessionRequest[];
  requestsLoading: boolean;
  teacherSessions: Session[];
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  totalSessions: {
    completed: number;
    upcoming: number;
  };
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleAcceptSession: (sessionId: string) => Promise<void>;
  handleRejectSession: (sessionId: string) => Promise<void>;
  handleStartClass: (sessionId: string) => Promise<void>;
}

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = ({
  activeTab,
  teacherCourses,
  coursesLoading,
  sessionRequests,
  requestsLoading,
  upcomingSessions,
  sessionsLoading,
  totalSessions,
  searchQuery,
  handleSearch,
  handleAcceptSession,
  handleRejectSession,
  handleStartClass,
}) => {
  
  if (activeTab === "overview") {
    return (
      <DashboardShell>
        <DashboardHeader 
          heading="Teacher Dashboard" 
          subheading="Manage your courses and sessions"
        />
        
        <StatsContainer>
          <StatsCard
            title="Total Courses"
            value={teacherCourses.length}
            icon={<BookOpen />}
            description="Active courses"
          />
          <StatsCard
            title="Upcoming Sessions"
            value={totalSessions.upcoming}
            icon={<Calendar />}
            description="Scheduled sessions"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Completed Sessions"
            value={totalSessions.completed}
            icon={<CheckCircle />}
            description="Total sessions completed"
          />
          <StatsCard
            title="Session Requests"
            value={sessionRequests.length}
            icon={<Video />}
            description="Pending requests"
          />
        </StatsContainer>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DashboardCard
            title="Session Requests"
            description="Pending session requests from students"
            isLoading={requestsLoading}
          >
            {sessionRequests.length > 0 ? (
              <div className="space-y-4">
                {sessionRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex flex-col space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {request.student?.first_name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{request.proposed_title}</h3>
                          <p className="text-xs text-muted-foreground">
                            From {request.student?.first_name} {request.student?.last_name}
                          </p>
                        </div>
                      </div>
                      <Badge>New Request</Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" /> 
                      Requested for {new Date(request.proposed_date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })} at {new Date(request.proposed_date).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAcceptSession(request.id)}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleRejectSession(request.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[150px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed">
                <Users className="h-10 w-10 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">No pending session requests</p>
              </div>
            )}
          </DashboardCard>
          
          <DashboardCard
            title="Upcoming Sessions"
            description="Your scheduled teaching sessions"
            isLoading={sessionsLoading}
          >
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex flex-col space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{session.title}</h3>
                      <Badge variant={session.status === "in_progress" ? "default" : "outline"}>
                        {session.status === "in_progress" ? "Live Now" : "Upcoming"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.course?.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" /> 
                      {new Date(session.start_time).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })} at {new Date(session.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                    {session.status === "in_progress" ? (
                      <Button onClick={() => handleStartClass(session.id)}>
                        Start Class
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        {new Date(session.start_time).getTime() - new Date().getTime() > 24 * 60 * 60 * 1000 
                          ? `In ${Math.floor((new Date(session.start_time).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))} days` 
                          : `In ${Math.floor((new Date(session.start_time).getTime() - new Date().getTime()) / (60 * 60 * 1000))} hours`}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[150px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed">
                <Calendar className="h-10 w-10 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
              </div>
            )}
          </DashboardCard>
        </div>
      </DashboardShell>
    );
  }
  
  if (activeTab === "courses") {
    return (
      <DashboardShell>
        <DashboardHeader 
          heading="My Courses" 
          subheading="Manage your teaching courses"
        />
        
        <DashboardCard isLoading={coursesLoading}>
          {teacherCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teacherCourses.map((course) => (
                <div key={course.id} className="flex flex-col rounded-lg border">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    {course.image_url ? (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <BookOpen className="h-10 w-10 text-muted-foreground/60" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline">{course.total_lessons} lessons</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
              <BookOpen className="h-16 w-16 text-muted-foreground/60" />
              <h3 className="text-xl font-medium">No Courses Yet</h3>
              <p className="text-sm text-muted-foreground">You haven't created any courses yet</p>
              <Button className="mt-4">Create a Course</Button>
            </div>
          )}
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  if (activeTab === "sessions") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Session Requests" />
        
        <DashboardCard isLoading={requestsLoading}>
          {sessionRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Requested Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {request.student?.first_name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {request.student?.first_name} {request.student?.last_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{request.proposed_title}</TableCell>
                    <TableCell>{request.course?.title}</TableCell>
                    <TableCell>
                      {new Date(request.proposed_date).toLocaleDateString()} at{" "}
                      {new Date(request.proposed_date).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" onClick={() => handleAcceptSession(request.id)}>
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectSession(request.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
              <Users className="h-16 w-16 text-muted-foreground/60" />
              <h3 className="text-xl font-medium">No Session Requests</h3>
              <p className="text-sm text-muted-foreground">You don't have any pending session requests</p>
            </div>
          )}
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  if (activeTab === "schedule") {
    return (
      <DashboardShell>
        <DashboardHeader heading="My Schedule" />
        
        <DashboardCard isLoading={sessionsLoading}>
          {upcomingSessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.title}</TableCell>
                    <TableCell>{session.course?.title}</TableCell>
                    <TableCell>
                      {new Date(session.start_time).toLocaleDateString()} at{" "}
                      {new Date(session.start_time).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={session.status === "in_progress" ? "default" : "outline"}>
                        {session.status === "in_progress" ? "Live Now" : 
                        session.status === "scheduled" ? "Upcoming" : session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {session.status === "in_progress" && (
                        <Button onClick={() => handleStartClass(session.id)}>
                          Start Class
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
              <Calendar className="h-16 w-16 text-muted-foreground/60" />
              <h3 className="text-xl font-medium">No Upcoming Sessions</h3>
              <p className="text-sm text-muted-foreground">You don't have any upcoming sessions scheduled</p>
            </div>
          )}
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  if (activeTab === "availability") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Set Your Availability" />
        <DashboardCard>
          <AvailabilityScheduler />
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  return null;
};

export default TeacherDashboardContent;
