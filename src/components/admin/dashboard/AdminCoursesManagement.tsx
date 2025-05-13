
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminCoursesManagement = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Courses Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Courses Management</CardTitle>
          <CardDescription>View, edit and manage all courses in the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is coming soon. You will be able to view and manage all courses,
            create new courses, edit existing ones, and assign teachers to courses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoursesManagement;
