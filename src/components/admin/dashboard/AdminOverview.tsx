import { useEffect } from "react";
import { useAdminStats, useAdminUsers } from "@/hooks/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  PieChart, 
  Bar, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Users, BookOpen, Calendar, TrendingUp, GraduationCap, Clock } from "lucide-react";

const AdminOverview = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: recentUsers = [], isLoading: usersLoading, error: usersError } = useAdminUsers("", 5);
  const { toast } = useToast();

  useEffect(() => {
    if (statsError instanceof Error) {
      toast({
        title: "Error loading statistics",
        description: statsError.message,
        variant: "destructive",
      });
    }
    
    if (usersError instanceof Error) {
      toast({
        title: "Error loading recent users",
        description: usersError.message,
        variant: "destructive",
      });
    }
  }, [statsError, usersError, toast]);

  // Sample data for charts
  const sessionRequestData = [
    { name: "Mon", requests: 4 },
    { name: "Tue", requests: 6 },
    { name: "Wed", requests: 8 },
    { name: "Thu", requests: 5 },
    { name: "Fri", requests: 9 },
    { name: "Sat", requests: 3 },
    { name: "Sun", requests: 2 }
  ];

  const userGrowthData = [
    { name: "Jan", users: 40 },
    { name: "Feb", users: 55 },
    { name: "Mar", users: 65 },
    { name: "Apr", users: 90 },
    { name: "May", users: 120 },
    { name: "Jun", users: 150 },
    { name: "Jul", users: 180 }
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch(role) {
      case 'admin':
        return 'destructive';
      case 'teacher':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {statsLoading ? (
                <span className="h-3 w-20 bg-muted animate-pulse rounded inline-block"></span>
              ) : (
                <span>+{stats?.newUsers || 0} since last week</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalTeachers || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {statsLoading ? (
                <span className="h-3 w-20 bg-muted animate-pulse rounded inline-block"></span>
              ) : (
                <span>{stats?.activeTeachers || 0} active teachers</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {statsLoading ? (
                <span className="h-3 w-20 bg-muted animate-pulse rounded inline-block"></span>
              ) : (
                <span>{stats?.totalSessions || 0} total sessions</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats?.pendingRequests || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Requests</CardTitle>
            <CardDescription>Session requests over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={sessionRequestData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>User growth over the past months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={userGrowthData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest users who joined the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No recent users found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
