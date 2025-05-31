
import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionRequest } from "@/hooks/types";

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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format the proposed date properly
  const formatProposedDate = (dateString: string) => {
    try {
      // Parse the date string and ensure we're using the correct date
      const date = new Date(dateString);
      console.log("SessionRequestCard - Original date string:", dateString);
      console.log("SessionRequestCard - Parsed date:", date.toISOString());
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return dateString;
      }
      
      // Format as "MMM d, yyyy • h:mm a" (e.g., "Jun 4, 2025 • 1:00 PM")
      const formattedDate = format(date, 'MMM d, yyyy • h:mm a');
      console.log("SessionRequestCard - Formatted date:", formattedDate);
      return formattedDate;
    } catch (error) {
      console.error("Error formatting proposed date:", error, { dateString });
      return dateString;
    }
  };

  return (
    <Card key={request.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{request.proposed_title}</CardTitle>
            <CardDescription>
              {request.student?.first_name} {request.student?.last_name}
              {request.course?.title && ` • ${request.course.title} course`}
            </CardDescription>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date & Time:</span>
            <span className="font-medium">{formatProposedDate(request.proposed_date)}</span>
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
