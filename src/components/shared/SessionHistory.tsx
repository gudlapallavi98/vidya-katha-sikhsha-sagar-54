import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, User, BookOpen } from "lucide-react";
import { format, subMonths } from "date-fns";

interface SessionHistoryProps {
  userType: 'teacher' | 'student';
}

interface SessionData {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  course?: {
    title: string;
  } | null;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ userType }) => {
  const { user } = useAuth();

  const { data: sessionHistory = [], isLoading } = useQuery({
    queryKey: ['session_history', user?.id, userType],
    queryFn: async (): Promise<SessionData[]> => {
      if (!user) return [];
      
      // Get sessions from 3 months ago
      const threeMonthsAgo = subMonths(new Date(), 3);
      
      let query = supabase
        .from('sessions')
        .select(`
          id,
          title,
          start_time,
          end_time,
          status,
          course:courses(title),
          profiles!sessions_teacher_id_fkey(first_name, last_name)
        `)
        .gte('end_time', threeMonthsAgo.toISOString())
        .lte('end_time', new Date().toISOString())
        .in('status', ['completed', 'cancelled'])
        .order('end_time', { ascending: false });

      if (userType === 'teacher') {
        query = query.eq('teacher_id', user.id);
      } else {
        // For students, we need to join with session_attendees
        const { data: attendedSessions, error } = await supabase
          .from('session_attendees')
          .select(`
            sessions!inner(
              id,
              title,
              start_time,
              end_time,
              status,
              course:courses(title),
              profiles!sessions_teacher_id_fkey(first_name, last_name)
            )
          `)
          .eq('student_id', user.id)
          .eq('attended', true)
          .gte('sessions.end_time', threeMonthsAgo.toISOString())
          .lte('sessions.end_time', new Date().toISOString())
          .in('sessions.status', ['completed', 'cancelled'])
          .order('sessions.end_time', { ascending: false });

        if (error) {
          console.error('Error fetching attended sessions:', error);
          throw error;
        }

        return (attendedSessions || []).map(item => item.sessions as SessionData);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching session history:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSessionDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatSessionTime = (startTime: string, endTime: string) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return `${startTime} - ${endTime}`;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading session history...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Session History</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last 3 months • {sessionHistory.length} sessions
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessionHistory.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Session History</h3>
              <p className="text-muted-foreground">
                Your completed sessions will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Time</TableHead>
                  {userType === 'teacher' && <TableHead>Student</TableHead>}
                  {userType === 'student' && <TableHead>Teacher</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionHistory.map((session) => {
                  const startTime = new Date(session.start_time);
                  const endTime = new Date(session.end_time);
                  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
                  
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.title}</TableCell>
                      <TableCell>{session.course?.title || 'Individual Session'}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {formatSessionDate(session.start_time)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatSessionTime(session.start_time, session.end_time)}
                          </div>
                        </div>
                      </TableCell>
                      {(userType === 'teacher' || userType === 'student') && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {session.profiles?.first_name} {session.profiles?.last_name}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{durationMinutes} min</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionHistory;
