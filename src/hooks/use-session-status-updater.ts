
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionStatusUpdater = () => {
  useEffect(() => {
    const updateSessionStatuses = async () => {
      const now = new Date();
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

      try {
        // Update past sessions that are still "in_progress" to "completed" if they have attendance
        // or "scheduled" if no one joined
        const { data: pastSessions } = await supabase
          .from('sessions')
          .select(`
            id,
            end_time,
            status,
            session_attendees(attended)
          `)
          .eq('status', 'in_progress')
          .lte('end_time', now.toISOString());

        if (pastSessions) {
          for (const session of pastSessions) {
            const hasAttendance = session.session_attendees?.some(attendee => attendee.attended);
            const newStatus = hasAttendance ? 'completed' : 'scheduled';
            
            await supabase
              .from('sessions')
              .update({ status: newStatus })
              .eq('id', session.id);
          }
        }

        // Update sessions older than 5 days with no status update
        await supabase
          .from('sessions')
          .update({ status: 'cancelled' })
          .eq('status', 'scheduled')
          .lte('start_time', fiveDaysAgo.toISOString());

      } catch (error) {
        console.error('Error updating session statuses:', error);
      }
    };

    // Run immediately and then every 5 minutes
    updateSessionStatuses();
    const interval = setInterval(updateSessionStatuses, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
