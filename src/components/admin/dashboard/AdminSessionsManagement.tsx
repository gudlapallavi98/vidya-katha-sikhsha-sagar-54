
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSessionsManagement = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Sessions Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Sessions Management</CardTitle>
          <CardDescription>View, schedule and manage teaching sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is coming soon. You will be able to view all scheduled sessions,
            create new sessions, reschedule or cancel existing ones, and manage attendance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSessionsManagement;
