import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser, AdminStats } from '@/components/types/admin';
import { useQuery } from '@tanstack/react-query';

export const useAdminUsers = (searchQuery = '', roleFilter = '') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin_users', searchQuery, roleFilter],
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
      
      // Fetch users with proper error handling
      // First, check if the 'email' column exists in the profiles table
      const { data: columnsData } = await supabase
        .from('profiles')
        .select()
        .limit(1);
      
      // Define the fields to select based on available columns
      // Ensure these match the AdminUser interface structure
      let selectFields = 'id, first_name, last_name, role, created_at';
      
      // Only include email if it exists in the profiles table
      // This is a temporary fix; if email is needed but not in the DB,
      // a migration should be run to add it
      if (columnsData && columnsData[0] && 'email' in columnsData[0]) {
        selectFields += ', email';
      }
      
      let query = supabase
        .from('profiles')
        .select(selectFields);
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
        // Only include email in the search if it exists
        if (columnsData && columnsData[0] && 'email' in columnsData[0]) {
          query = query.or(`email.ilike.%${searchQuery}%`);
        }
      }
      
      // Apply role filter if provided
      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }
      
      // Order by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // If email isn't in the database but needed for the AdminUser type,
      // add a placeholder for type compatibility
      const processedData = data?.map(user => {
        // If email isn't present in the database but required in the AdminUser type,
        // add a placeholder email derived from the user's name
        if (!('email' in user) && user.first_name && user.last_name) {
          return {
            ...user,
            email: `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@placeholder.com`
          };
        }
        return user;
      }) || [];
      
      return processedData as AdminUser[];
    },
    enabled: !!user,
  });
};

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
      
      // Get students count
      const { count: studentsCount, error: studentsError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'student');
      
      if (studentsError) throw studentsError;
      
      // Get teachers count
      const { count: teachersCount, error: teachersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'teacher');
      
      if (teachersError) throw teachersError;
      
      // Get courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: true });
      
      if (coursesError) throw coursesError;
      
      // Get sessions count
      const { count: sessionsCount, error: sessionsError } = await supabase
        .from('sessions')
        .select('id', { count: 'exact', head: true });
      
      if (sessionsError) throw sessionsError;
      
      // Get new users in past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: newUsersCount, error: newUsersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());
      
      if (newUsersError) throw newUsersError;
      
      // Get new sessions in past week
      const { count: newSessionsCount, error: newSessionsError } = await supabase
        .from('sessions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());
      
      if (newSessionsError) throw newSessionsError;
      
      return {
        totalStudents: studentsCount || 0,
        totalTeachers: teachersCount || 0, 
        totalCourses: coursesCount || 0,
        totalSessions: sessionsCount || 0,
        newUsersPastWeek: newUsersCount || 0,
        newSessionsPastWeek: newSessionsCount || 0
      } as AdminStats;
    },
    enabled: !!user,
  });
};
