
export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
  totalSessions: number;
  newUsers: number;
  activeTeachers: number;
  pendingRequests: number;
  sessionCompletionRate: number;
  courseCompletionRate: number;
  averageSessionRating: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  monthlySessionsData: { month: string; sessions: number }[];
  monthlyUsersData: { month: string; users: number }[];
}

export interface AdminDashboardData {
  recentUsers: AdminUser[];
  stats: AdminStats;
  sessionRequestsChart: {
    labels: string[];
    data: number[];
  };
  userGrowthChart: {
    labels: string[];
    data: number[];
  };
}

export interface AdminSessionRequest {
  id: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
  };
  proposed_title: string;
  request_message?: string;
  proposed_date: string;
  proposed_duration: number;
  status: string;
  created_at: string;
}
