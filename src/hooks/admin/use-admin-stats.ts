
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AdminStats } from '@/components/types/admin';

/**
 * Custom hook to fetch admin dashboard statistics
 */
export const useAdminStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      // Verify the user is an admin
      if (!user) throw new Error('Not authenticated');
      
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (currentUserError) throw currentUserError;
      if (currentUserData.role !== 'admin') throw new Error('Unauthorized: admin access required');
      
      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Get total teachers count
      const { count: totalTeachers, error: teachersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');
      
      if (teachersError) throw teachersError;
      
      // Get total students count
      const { count: totalStudents, error: studentsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
      
      if (studentsError) throw studentsError;
      
      // Get total courses count
      const { count: totalCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      
      if (coursesError) throw coursesError;
      
      // Get total sessions count
      const { count: totalSessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });
      
      if (sessionsError) throw sessionsError;
      
      // Get new users in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: newUsers, error: newUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      
      if (newUsersError) throw newUsersError;
      
      // Active teachers (with at least one session in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeTeachersData, error: activeTeachersError } = await supabase
        .from('sessions')
        .select('teacher_id')
        .gte('start_time', thirtyDaysAgo.toISOString())
        .order('teacher_id');
      
      if (activeTeachersError) throw activeTeachersError;
      
      // Count unique teachers
      const uniqueTeachers = new Set();
      activeTeachersData?.forEach(session => {
        if (session.teacher_id) uniqueTeachers.add(session.teacher_id);
      });
      const activeTeachers = uniqueTeachers.size;
      
      // Get pending session requests count
      const { count: pendingRequests, error: pendingRequestsError } = await supabase
        .from('session_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (pendingRequestsError) throw pendingRequestsError;
      
      const stats: AdminStats = {
        totalUsers: totalUsers || 0,
        totalTeachers: totalTeachers || 0,
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalSessions: totalSessions || 0,
        newUsers: newUsers || 0,
        activeTeachers: activeTeachers || 0,
        pendingRequests: pendingRequests || 0,
      };
      
      return stats;
    },
    enabled: !!user,
  });
};
