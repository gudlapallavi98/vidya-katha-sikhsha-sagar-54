
import { supabase } from '@/integrations/supabase/client';
import { calculatePricing, createPaymentRecord } from '@/utils/pricingUtils';

// Session request handling
export const acceptSessionRequest = async (requestId: string) => {
  try {
    // Get the request details first
    const { data: request, error: fetchError } = await supabase
      .from('session_requests')
      .select(`
        *,
        availability:teacher_availability(
          available_date,
          start_time,
          end_time
        )
      `)
      .eq('id', requestId)
      .single();
      
    if (fetchError) throw fetchError;
    
    console.log("Accepting session request:", request);
    console.log("Original proposed_date:", request.proposed_date);
    console.log("Teacher availability:", request.availability);
    
    // Update the request status to 'approved' (not 'accepted' to avoid confusion)
    const { error: updateError } = await supabase
      .from('session_requests')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
      
    if (updateError) {
      console.error("Request update error:", updateError);
      throw updateError;
    }

    // If there's an availability_id, update the availability to mark it as booked
    if (request.availability_id) {
      console.log("Updating availability status to booked for ID:", request.availability_id);
      
      const { error: availabilityError } = await supabase
        .from('teacher_availability')
        .update({ 
          status: 'booked',
          booked_students: 1 // For one-to-one sessions
        })
        .eq('id', request.availability_id);
        
      if (availabilityError) {
        console.error("Availability update error:", availabilityError);
        // Don't throw here as the main operation succeeded
      } else {
        console.log("Successfully updated availability to booked");
      }
    }
    
    // Use the exact proposed_date from the request for session creation
    let sessionStartTime, sessionEndTime;
    
    if (request.availability && request.availability.available_date && request.availability.start_time && request.availability.end_time) {
      // Use the teacher's availability date and time if available
      const availabilityDate = request.availability.available_date;
      const startTime = request.availability.start_time;
      const endTime = request.availability.end_time;
      
      sessionStartTime = new Date(`${availabilityDate}T${startTime}`);
      sessionEndTime = new Date(`${availabilityDate}T${endTime}`);
      
      console.log("Using teacher availability for session times:", {
        availabilityDate,
        startTime,
        endTime,
        sessionStartTime: sessionStartTime.toISOString(),
        sessionEndTime: sessionEndTime.toISOString()
      });
    } else {
      // Fallback to proposed_date if availability is not available
      sessionStartTime = new Date(request.proposed_date);
      sessionEndTime = new Date(sessionStartTime.getTime() + request.proposed_duration * 60000);
      
      console.log("Using proposed_date for session times:", {
        proposedDate: request.proposed_date,
        duration: request.proposed_duration,
        sessionStartTime: sessionStartTime.toISOString(),
        sessionEndTime: sessionEndTime.toISOString()
      });
    }
    
    // Create a session based on the request
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        course_id: request.course_id,
        teacher_id: request.teacher_id,
        title: request.proposed_title,
        description: request.request_message,
        start_time: sessionStartTime.toISOString(),
        end_time: sessionEndTime.toISOString(),
        status: 'scheduled',
        meeting_link: `https://meet.jit.si/${requestId}-${new Date().getTime()}`,
        payment_amount: request.payment_amount,
        payment_status: request.payment_status
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
    console.log("Created session with times:", {
      sessionId: newSession.id,
      startTime: newSession.start_time,
      endTime: newSession.end_time
    });
    
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

    // Create teacher earnings record
    try {
      const pricing = calculatePricing(request.payment_amount / 1.1); // Reverse calculate teacher rate
      
      const { error: earningsError } = await supabase
        .from('teacher_earnings')
        .insert({
          teacher_id: request.teacher_id,
          session_id: newSession.id,
          amount: pricing.teacherPayout,
          status: 'pending'
        });

      if (earningsError) {
        console.error("Earnings creation error:", earningsError);
      }
    } catch (earningsError) {
      console.error("Error creating earnings record:", earningsError);
    }
    
    return newSession;
  } catch (error) {
    console.error("Error accepting session request:", error);
    throw error;
  }
};

export const rejectSessionRequest = async (requestId: string) => {
  try {
    // Get the request details first to free up availability if needed
    const { data: request, error: fetchError } = await supabase
      .from('session_requests')
      .select('availability_id')
      .eq('id', requestId)
      .single();
      
    if (fetchError) throw fetchError;

    // Update the request status
    const { error } = await supabase
      .from('session_requests')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
      
    if (error) throw error;

    // If there was an availability slot, make it available again
    if (request.availability_id) {
      console.log("Updating availability status back to available for ID:", request.availability_id);
      
      const { error: availabilityError } = await supabase
        .from('teacher_availability')
        .update({ 
          status: 'available',
          booked_students: 0
        })
        .eq('id', request.availability_id);
        
      if (availabilityError) {
        console.error("Availability update error:", availabilityError);
        // Don't throw here as the main operation succeeded
      } else {
        console.log("Successfully updated availability back to available");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error rejecting session request:", error);
    throw error;
  }
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

// Function to submit session request with proper error handling
export const submitSessionRequest = async (requestData: {
  student_id: string;
  teacher_id: string;
  availability_id: string;
  proposed_title: string;
  request_message?: string;
  proposed_date: string;
  proposed_duration: number;
  payment_amount?: number;
  session_type?: string;
}) => {
  try {
    console.log("Submitting session request:", requestData);
    
    const { data, error } = await supabase
      .from('session_requests')
      .insert({
        student_id: requestData.student_id,
        teacher_id: requestData.teacher_id,
        availability_id: requestData.availability_id,
        proposed_title: requestData.proposed_title,
        request_message: requestData.request_message || '',
        proposed_date: requestData.proposed_date,
        proposed_duration: requestData.proposed_duration,
        payment_amount: requestData.payment_amount || 0,
        session_type: requestData.session_type || 'individual',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error("Session request submission error:", error);
      throw error;
    }

    console.log("Session request submitted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error submitting session request:", error);
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
