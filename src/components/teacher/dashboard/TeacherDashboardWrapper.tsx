
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeacherDashboardContainer from "./TeacherDashboardContainer";

// Create a client
const queryClient = new QueryClient();

/**
 * Wrapper component to provide React Query context
 */
const TeacherDashboardWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TeacherDashboardContainer />
    </QueryClientProvider>
  );
};

export default TeacherDashboardWrapper;
