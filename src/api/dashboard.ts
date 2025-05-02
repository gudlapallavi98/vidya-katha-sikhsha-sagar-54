
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
    // Note: We're creating the session with the correct teacher_id which is critical for RLS
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        course_id: request.course_id,
        teacher_id: request.teacher_id,  // This needs to match the current user's ID for RLS
        title: request.proposed_title,
        description: request.request_message,
        start_time: request.proposed_date,
        end_time: new Date(new Date(request.proposed_date).getTime() + request.proposed_duration * 60000).toISOString(),
        status: 'scheduled'
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
  // Update attendee record with join time
  const { error } = await supabase
    .from('session_attendees')
    .update({ 
      join_time: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .eq('student_id', userId);
    
  if (error) throw error;
  
  // Get the meeting link
  const { data, error: sessionError } = await supabase
    .from('sessions')
    .select('meeting_link')
    .eq('id', sessionId)
    .single();
    
  if (sessionError) throw sessionError;
  
  return data.meeting_link;
};

export const startSession = async (sessionId: string) => {
  // Generate a meeting link (in real app, integrate with video service)
  const meetingLink = `https://meet.jit.si/${sessionId}`;
  
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
};
