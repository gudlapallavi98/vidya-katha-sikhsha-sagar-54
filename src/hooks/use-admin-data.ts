
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser, AdminStats } from '@/components/types/admin';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch users for admin dashboard
 */
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
      
      // Check if the 'email' column exists in the profiles table
      const { data: columnsData } = await supabase
        .from('profiles')
        .select()
        .limit(1);
      
      // Define fields to select based on available columns
      const hasEmailColumn = columnsData?.[0] && 'email' in columnsData[0];
      let selectFields = 'id, first_name, last_name, role, created_at';
      
      if (hasEmailColumn) {
        selectFields += ', email';
      }
      
      // Build the query
      let query = supabase.from('profiles').select(selectFields);
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
        if (hasEmailColumn) {
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
      
      if (!data) return [] as AdminUser[];
      
      // Process data safely
      return data.map(user => createSafeUserObject(user, hasEmailColumn));
    },
    enabled: !!user,
  });
};

/**
 * Helper function to create a safe user object, handling null values
 */
const createSafeUserObject = (user: any | null, hasEmailColumn: boolean): AdminUser => {
  // Handle null user case
  if (!user) {
    return {
      id: 'unknown',
      first_name: 'Unknown',
      last_name: 'User',
      email: 'unknown@placeholder.com',
      role: 'unknown',
      created_at: new Date().toISOString()
    };
  }
  
  // Create a base user with all required fields
  const baseUser: AdminUser = {
    id: user.id || 'unknown',
    first_name: user.first_name || 'Unknown',
    last_name: user.last_name || 'User',
    role: user.role || 'unknown',
    created_at: user.created_at || new Date().toISOString(),
    email: 'placeholder@example.com' // Default value
  };
  
  // Add email if it exists in the database
  if (hasEmailColumn && 'email' in user && user.email) {
    baseUser.email = user.email;
  } else {
    // Generate a placeholder email based on name
    const firstName = String(user.first_name || 'user').toLowerCase();
    const lastName = String(user.last_name || 'unknown').toLowerCase();
    baseUser.email = `${firstName}.${lastName}@placeholder.com`;
  }
  
  return baseUser;
};

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
