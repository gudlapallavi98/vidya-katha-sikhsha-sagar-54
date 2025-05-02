
import { supabase } from '@/integrations/supabase/client';

// Session request handling
export const acceptSessionRequest = async (requestId: string) => {
  try {
    // Get the request details first
    const { data: request, error: fetchError } = await supabase
      .from('session_requests')
      .select('*')
      .eq('id', requestId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Create a session based on the request
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        course_id: request.course_id,
        teacher_id: request.teacher_id,
        title: request.proposed_title,
        description: request.request_message,
        start_time: request.proposed_date,
        end_time: new Date(new Date(request.proposed_date).getTime() + request.proposed_duration * 60000).toISOString(),
        status: 'scheduled',
        meeting_link: `https://meet.jit.si/${requestId}-${new Date().getTime()}`
      })
      .select();
    
    if (sessionError) {
      console.error("Session creation error:", sessionError);
      throw sessionError;
    }
    
    if (!session || session.length === 0) {
      throw new Error("Failed to create session");
    }
    
    const newSession = session[0];
    
    // Update the request status
    const { error: updateError } = await supabase
      .from('session_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);
      
    if (updateError) {
      console.error("Request update error:", updateError);
      throw updateError;
    }
    
    // Create session attendance entry for the student
    const { error: attendeeError } = await supabase
      .from('session_attendees')
      .insert({
        session_id: newSession.id,
        student_id: request.student_id
      });
      
    if (attendeeError) {
      console.error("Attendee creation error:", attendeeError);
      throw attendeeError;
    }
    
    return newSession;
  } catch (error) {
    console.error("Error accepting session request:", error);
    throw error;
  }
};

export const rejectSessionRequest = async (requestId: string) => {
  const { error } = await supabase
    .from('session_requests')
    .update({ status: 'rejected' })
    .eq('id', requestId);
    
  if (error) throw error;
  
  return true;
};

// Session management
export const joinSession = async (sessionId: string, userId: string) => {
  try {
    // Update attendee record with join time
    const { error } = await supabase
      .from('session_attendees')
      .update({ 
        join_time: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('student_id', userId);
      
    if (error) {
      console.error("Error updating join time:", error);
      // Don't throw here, as we still want to get the meeting link
    }
    
    // Get the meeting link
    const { data, error: sessionError } = await supabase
      .from('sessions')
      .select('meeting_link')
      .eq('id', sessionId)
      .single();
      
    if (sessionError) throw sessionError;
    
    if (!data || !data.meeting_link) {
      throw new Error("Meeting link not available");
    }
    
    return data.meeting_link;
  } catch (error) {
    console.error("Error joining session:", error);
    throw error;
  }
};

export const startSession = async (sessionId: string) => {
  try {
    // Generate a meeting link if not already set
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('meeting_link')
      .eq('id', sessionId)
      .single();
      
    const meetingLink = existingSession?.meeting_link || `https://meet.jit.si/${sessionId}-${new Date().getTime()}`;
    
    // Update the session with meeting link and status
    const { error } = await supabase
      .from('sessions')
      .update({ 
        meeting_link: meetingLink,
        status: 'in_progress' 
      })
      .eq('id', sessionId);
      
    if (error) throw error;
    
    return meetingLink;
  } catch (error) {
    console.error("Error starting session:", error);
    throw error;
  }
};

// New function to get teacher profiles
export const getTeacherProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'teacher');
    
  if (error) throw error;
  return data;
};

// Function to get a teacher's profile by ID
export const getTeacherProfile = async (teacherId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', teacherId)
    .single();
    
  if (error) throw error;
  return data;
};
