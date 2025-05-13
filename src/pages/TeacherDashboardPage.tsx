
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeacherDashboardWrapper from "@/components/teacher/dashboard/TeacherDashboardWrapper";

// Create a client
const queryClient = new QueryClient();

/**
 * Main page component for the teacher dashboard
 * Serves as an entry point that renders the dashboard wrapper
 * with React Query provider for data fetching
 */
const TeacherDashboardPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TeacherDashboardWrapper />
    </QueryClientProvider>
  );
};

export default TeacherDashboardPage;
