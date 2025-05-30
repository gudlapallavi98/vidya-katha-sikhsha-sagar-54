
import React from "react";
import SessionRequestCard from "./SessionRequestCard";
import { SessionRequest } from "@/hooks/types";

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
  // Filter requests based on status
  const getFilteredRequests = () => {
    if (status === "accepted") {
      return requests.filter(req => 
        req.status === "approved" || 
        req.status === "accepted" || 
        req.status === "confirmed"
      );
    }
    return requests.filter(req => req.status === status);
  };

  const filteredRequests = getFilteredRequests();
  
  if (filteredRequests.length === 0) {
    const displayStatus = status === "accepted" ? "approved" : status;
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No {displayStatus} session requests</p>
        {status === "accepted" && (
          <p className="text-sm text-muted-foreground mt-2">
            Approved requests will appear here once you accept student session requests.
          </p>
        )}
      </div>
    );
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
