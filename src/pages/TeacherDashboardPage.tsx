
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeacherDashboardWrapper from "@/components/teacher/dashboard/TeacherDashboardWrapper";

// Create a persistent QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

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
