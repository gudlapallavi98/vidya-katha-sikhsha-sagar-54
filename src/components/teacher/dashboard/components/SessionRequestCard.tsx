
import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionRequest } from "@/hooks/use-session-requests";

interface SessionRequestCardProps {
  request: SessionRequest;
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

const SessionRequestCard: React.FC<SessionRequestCardProps> = ({
  request,
  onAccept,
  onReject
}) => {
  return (
    <Card key={request.id} className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{request.proposed_title}</CardTitle>
        <CardDescription>
          {request.student.first_name} {request.student.last_name}
          {request.course?.title && ` • ${request.course.title} course`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date & Time:</span>
            <span>{format(new Date(request.proposed_date), 'MMM d, yyyy • h:mm a')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span>{request.proposed_duration} minutes</span>
          </div>
          {request.request_message && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-1">Message:</p>
              <p className="text-sm bg-muted p-2 rounded">{request.request_message}</p>
            </div>
          )}
          
          {request.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button 
                className="flex-1 bg-indian-green hover:bg-indian-green/90 text-white"
                onClick={() => onAccept(request.id)}
              >
                Accept
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => onReject(request.id)}
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionRequestCard;
