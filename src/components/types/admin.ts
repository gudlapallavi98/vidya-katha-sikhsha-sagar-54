
export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalSessions: number;
  newUsersPastWeek: number;
  newSessionsPastWeek: number;
}

export interface AdminTableData {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

export interface AdminChartData {
  name: string;
  value: number;
}
