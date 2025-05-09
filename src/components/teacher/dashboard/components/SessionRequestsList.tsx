
import React from "react";
import SessionRequestCard from "./SessionRequestCard";
import { SessionRequest } from "@/hooks/use-session-requests";

interface SessionRequestsListProps {
  requests: SessionRequest[];
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  status: string;
}

const SessionRequestsList: React.FC<SessionRequestsListProps> = ({
  requests,
  onAccept,
  onReject,
  status
}) => {
  const filteredRequests = requests.filter(req => req.status === status);
  
  if (filteredRequests.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No {status} session requests</p>;
  }
  
  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => (
        <SessionRequestCard
          key={request.id}
          request={request}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
};

export default SessionRequestsList;
