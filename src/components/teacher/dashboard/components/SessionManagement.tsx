
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Users, Video, FileText } from "lucide-react";

interface Session {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  meeting_link: string | null;
  session_notes: string | null;
  recording_url: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  course: { title: string } | null;
  session_attendees: Array<{
    student: { first_name: string; last_name: string };
  }>;
}

const SessionManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionNotes, setSessionNotes] = useState("");

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['teacher_sessions_detailed', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title),
          session_attendees(
            student:profiles!session_attendees_student_id_fkey(first_name, last_name)
          )
        `)
        .eq('teacher_id', user?.id)
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      return data as Session[];
    },
    enabled: !!user,
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: any }) => {
      const { error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', sessionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher_sessions_detailed'] });
      toast({ title: "Session updated successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update session",
        description: error.message,
      });
    },
  });

  const handleStartSession = (session: Session) => {
    const meetingLink = session.meeting_link || `https://meet.jit.si/${session.id}-${Date.now()}`;
    
    updateSessionMutation.mutate({
      sessionId: session.id,
      updates: { 
        status: 'in_progress',
        meeting_link: meetingLink
      }
    });

    // Open meeting in new tab
    window.open(meetingLink, '_blank');
  };

  const handleEndSession = (session: Session) => {
    updateSessionMutation.mutate({
      sessionId: session.id,
      updates: { status: 'completed' }
    });
  };

  const handleSaveNotes = () => {
    if (!selectedSession) return;
    
    updateSessionMutation.mutate({
      sessionId: selectedSession.id,
      updates: { session_notes: sessionNotes }
    });
    
    setSelectedSession(null);
    setSessionNotes("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Session Management</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {sessions.length} total sessions
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Sessions Yet</h3>
              <p className="text-muted-foreground">
                Your scheduled sessions will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{session.title}</div>
                        {session.course && (
                          <div className="text-sm text-muted-foreground">
                            {session.course.title}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(session.start_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(session.start_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} - {new Date(session.end_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.session_attendees.length}
                      </div>
                      {session.session_attendees.map((attendee, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {attendee.student.first_name} {attendee.student.last_name}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getPaymentStatusColor(session.payment_status)}>
                          {session.payment_status || 'pending'}
                        </Badge>
                        {session.payment_amount && (
                          <div className="text-sm">₹{session.payment_amount}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {session.status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartSession(session)}
                          >
                            Start
                          </Button>
                        )}
                        
                        {session.status === 'in_progress' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(session.meeting_link!, '_blank')}
                            >
                              Join
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEndSession(session)}
                            >
                              End
                            </Button>
                          </>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedSession(session);
                                setSessionNotes(session.session_notes || "");
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Session Notes</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">{session.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.start_time).toLocaleString()}
                                </p>
                              </div>
                              <Textarea
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                                placeholder="Add your session notes here..."
                                rows={6}
                              />
                              <Button onClick={handleSaveNotes} className="w-full">
                                Save Notes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionManagement;
