
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AdminStats = {
  totalCourses: number;
  totalStudents: number;
  totalTeachers: number;
  totalUsers: number; // Add this property
  newUsers: number; // Add this property
  activeTeachers: number; // Add this property
  sessionCompletionRate: number;
  courseCompletionRate: number;
  averageSessionRating: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  monthlySessionsData: { month: string; sessions: number }[];
  monthlyUsersData: { month: string; users: number }[];
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      // Fetch total courses
      const { count: totalCourses, error: coursesError } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });
      
      if (coursesError) throw new Error(coursesError.message);
      
      // Fetch total students 
      const { count: totalStudents, error: studentsError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");
      
      if (studentsError) throw new Error(studentsError.message);

      // Fetch total teachers
      const { count: totalTeachers, error: teachersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "teacher");
      
      if (teachersError) throw new Error(teachersError.message);
      
      // Fetch active teachers (with at least one course)
      const { count: activeTeachers, error: activeTeachersError } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "teacher")
        .in("id", supabase.from("courses").select("teacher_id"));
      
      if (activeTeachersError) throw new Error(activeTeachersError.message);
      
      // Calculate total users
      const totalUsers = (totalStudents || 0) + (totalTeachers || 0);
      
      // Use date functions to calculate new users in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newUsers, error: newUsersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());
      
      if (newUsersError) throw new Error(newUsersError.message);
      
      // Mock data for other stats that may require more complex queries
      // In a real application, you would implement these properly
      const sessionCompletionRate = 85; // Placeholder value
      const courseCompletionRate = 72; // Placeholder value
      const averageSessionRating = 4.7; // Placeholder value
      const revenueThisMonth = 12450; // Placeholder value
      const revenueLastMonth = 10200; // Placeholder value
      
      // Generate monthly sessions data (placeholder)
      const monthlySessionsData = [
        { month: "Jan", sessions: 145 },
        { month: "Feb", sessions: 167 },
        { month: "Mar", sessions: 190 },
        { month: "Apr", sessions: 205 },
        { month: "May", sessions: 230 },
        { month: "Jun", sessions: 245 }
      ];
      
      // Generate monthly users data (placeholder)
      const monthlyUsersData = [
        { month: "Jan", users: 50 },
        { month: "Feb", users: 65 },
        { month: "Mar", users: 80 },
        { month: "Apr", users: 95 },
        { month: "May", users: 110 },
        { month: "Jun", users: 125 }
      ];

      return {
        totalCourses: totalCourses || 0,
        totalStudents: totalStudents || 0,
        totalTeachers: totalTeachers || 0,
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        activeTeachers: activeTeachers || 0,
        sessionCompletionRate,
        courseCompletionRate,
        averageSessionRating,
        revenueThisMonth,
        revenueLastMonth,
        monthlySessionsData,
        monthlyUsersData
      };
    }
  });
};
