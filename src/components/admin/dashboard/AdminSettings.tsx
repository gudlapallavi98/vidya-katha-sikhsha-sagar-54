
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Admin Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Configure system-wide settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is coming soon. You will be able to configure platform-wide settings,
            manage email templates, update site content, and control user permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
