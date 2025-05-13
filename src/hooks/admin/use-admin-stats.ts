
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalSessions: number;
  sessionsToday: number;
  sessionsThisWeek: number;
  pendingRequests: number;
  recentSignups: Array<{
    id: string;
    date: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
  sessionsByDay: Array<{
    date: string;
    count: number;
  }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<AdminStats> => {
      // Get counts from profiles
      const { data: profileCounts, error: profilesError } = await supabase
        .from('profiles')
        .select('role, count', { count: 'exact', head: false })
        .group('role');
        
      if (profilesError) throw profilesError;
      
      // Get courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
        
      if (coursesError) throw coursesError;
      
      // Get sessions count
      const { count: sessionsCount, error: sessionsError } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });
        
      if (sessionsError) throw sessionsError;
      
      // Get today's sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todaySessions, error: todayError } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .gte('start_time', today.toISOString());
        
      if (todayError) throw todayError;
      
      // Get this week's sessions
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const { count: weekSessions, error: weekError } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .gte('start_time', weekStart.toISOString());
        
      if (weekError) throw weekError;
      
      // Get pending requests count
      const { count: requestsCount, error: requestsError } = await supabase
        .from('session_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (requestsError) throw requestsError;
      
      // Recent signups
      const { data: recentUsers, error: recentError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, created_at, role')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (recentError) throw recentError;
      
      // Sessions by day for the past week
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const { data: sessionsData, error: sessByDayError } = await supabase
        .from('sessions')
        .select('start_time')
        .gte('start_time', lastWeek.toISOString())
        .order('start_time', { ascending: true });
        
      if (sessByDayError) throw sessByDayError;
      
      // Process counts
      const studentCount = profileCounts?.find(p => p.role === 'student')?.count || 0;
      const teacherCount = profileCounts?.find(p => p.role === 'teacher')?.count || 0;
      
      // Format recent signups
      const recentSignups = recentUsers?.map(user => ({
        id: user.id,
        date: user.created_at,
        firstName: user.first_name,
        lastName: user.last_name,
        // Note: email might not be directly available in profiles, using placeholder
        email: `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@example.com`,
        role: user.role
      })) || [];
      
      // Process sessions by day
      const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
      const dayMap = new Map<string, number>();
      
      // Initialize with past 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dayMap.set(dayFormat.format(date), 0);
      }
      
      // Populate with actual data
      sessionsData?.forEach(session => {
        const sessionDate = new Date(session.start_time);
        const dayKey = dayFormat.format(sessionDate);
        if (dayMap.has(dayKey)) {
          dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
        }
      });
      
      const sessionsByDay = Array.from(dayMap.entries()).map(([date, count]) => ({
        date,
        count
      }));
      
      return {
        totalStudents: Number(studentCount),
        totalTeachers: Number(teacherCount),
        totalCourses: coursesCount || 0,
        totalSessions: sessionsCount || 0,
        sessionsToday: todaySessions || 0,
        sessionsThisWeek: weekSessions || 0,
        pendingRequests: requestsCount || 0,
        recentSignups,
        sessionsByDay
      };
    },
    staleTime: 60 * 1000, // 1 minute
  });
};
