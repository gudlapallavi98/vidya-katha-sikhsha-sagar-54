
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminRequestsManagement = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Session Requests</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Session Requests Management</CardTitle>
          <CardDescription>Manage and moderate session requests from students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is coming soon. You will be able to view all session requests,
            approve or reject requests, and assign teachers to specific requests if needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequestsManagement;
