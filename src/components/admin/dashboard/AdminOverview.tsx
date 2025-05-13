
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AdminStats, AdminChartData } from "@/components/types/admin";
import { useToast } from "@/hooks/use-toast";

const AdminOverview = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalSessions: 0,
    newUsersPastWeek: 0,
    newSessionsPastWeek: 0
  });
  const [chartPeriod, setChartPeriod] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        // Get total students count
        const { count: studentsCount, error: studentsError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'student');
          
        if (studentsError) throw studentsError;
        
        // Get total teachers count
        const { count: teachersCount, error: teachersError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'teacher');
          
        if (teachersError) throw teachersError;
          
        // Get total courses count
        const { count: coursesCount, error: coursesError } = await supabase
          .from('courses')
          .select('id', { count: 'exact', head: true });
          
        if (coursesError) throw coursesError;
          
        // Get total sessions count
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
          
        setStats({
          totalStudents: studentsCount || 0,
          totalTeachers: teachersCount || 0,
          totalCourses: coursesCount || 0,
          totalSessions: sessionsCount || 0,
          newUsersPastWeek: newUsersCount || 0,
          newSessionsPastWeek: newSessionsCount || 0
        });
      } catch (error) {
        console.error('Error fetching admin statistics:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard statistics"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [toast]);

  // Sample data for charts - in a real app, this would come from the database
  const userDistributionData: AdminChartData[] = [
    { name: 'Students', value: stats.totalStudents },
    { name: 'Teachers', value: stats.totalTeachers }
  ];
  
  const activityData = [
    { name: 'Mon', sessions: 4, users: 3 },
    { name: 'Tue', sessions: 6, users: 5 },
    { name: 'Wed', sessions: 8, users: 7 },
    { name: 'Thu', sessions: 7, users: 6 },
    { name: 'Fri', sessions: 9, users: 8 },
    { name: 'Sat', sessions: 5, users: 4 },
    { name: 'Sun', sessions: 3, users: 2 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">{isLoading ? "..." : stats.totalStudents}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Teachers</CardDescription>
            <CardTitle className="text-3xl">{isLoading ? "..." : stats.totalTeachers}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-3xl">{isLoading ? "..." : stats.totalCourses}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-3xl">{isLoading ? "..." : stats.totalSessions}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Growth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>New Users (Past Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : stats.newUsersPastWeek}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>New Sessions (Past Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : stats.newSessionsPastWeek}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Activity Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <Tabs defaultValue="week" value={chartPeriod} onValueChange={setChartPeriod}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" name="New Users" fill="#8884d8" />
                  <Bar dataKey="sessions" name="Sessions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
