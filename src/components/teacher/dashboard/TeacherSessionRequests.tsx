
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SessionRequestsList from "./components/SessionRequestsList";
import { useFetchSessionRequests } from "@/hooks/use-fetch-session-requests";
import { useSessionStatusChange } from "@/hooks/use-session-status";

interface TeacherSessionRequestsProps {
  sessionRequests: any[];
  requestsLoading: boolean;
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleAcceptSession: (sessionId: string) => Promise<void>;
  handleRejectSession: (sessionId: string) => Promise<void>;
}

const TeacherSessionRequests: React.FC<TeacherSessionRequestsProps> = ({
  sessionRequests,
  requestsLoading,
  searchQuery,
  handleSearch,
  handleAcceptSession,
  handleRejectSession,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");

  const handleAccept = async (requestId: string) => {
    await handleAcceptSession(requestId);
  };

  const handleReject = async (requestId: string) => {
    await handleRejectSession(requestId);
  };

  if (requestsLoading) {
    return (
      <div className="p-4">
        <div className="h-[200px] flex items-center justify-center">
          <p>Loading session requests...</p>
        </div>
      </div>
    );
  }

  // Filter requests by status for each tab
  const pendingRequests = sessionRequests.filter(request => request.status === "pending");
  const acceptedRequests = sessionRequests.filter(request => request.status === "accepted");
  const rejectedRequests = sessionRequests.filter(request => request.status === "rejected");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Session Requests</h2>
        <p className="text-muted-foreground">Manage your incoming session requests from students</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length > 0 ? (
            <SessionRequestsList 
              requests={pendingRequests} 
              onAccept={handleAccept} 
              onReject={handleReject}
              status="pending"
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">No pending requests found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="accepted" className="space-y-4">
          {acceptedRequests.length > 0 ? (
            <SessionRequestsList 
              requests={acceptedRequests} 
              onAccept={handleAccept} 
              onReject={handleReject}
              status="accepted"
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">No accepted requests found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.length > 0 ? (
            <SessionRequestsList 
              requests={rejectedRequests} 
              onAccept={handleAccept} 
              onReject={handleReject}
              status="rejected"
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">No rejected requests found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherSessionRequests;
