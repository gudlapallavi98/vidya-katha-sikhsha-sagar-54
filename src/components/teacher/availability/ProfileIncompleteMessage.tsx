
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ProfileIncompleteMessage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p>Please complete your profile before scheduling availability.</p>
          <Button onClick={() => window.location.href = "/teacher-dashboard?tab=profile"}>
            Go to Profile Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileIncompleteMessage;
