
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SessionRequestsList from "./components/SessionRequestsList";
import { useSessionRequests, useSessionStatusChange } from "@/hooks/use-session-requests";

const TeacherSessionRequests = () => {
  const { sessionRequests, loading } = useSessionRequests();
  const { handleStatusChange } = useSessionStatusChange();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");

  const handleAccept = async (requestId: string) => {
    const success = await handleStatusChange(requestId, 'accepted');
    if (success) {
      // Force reload the component or update state
      window.location.reload();
    }
  };

  const handleReject = async (requestId: string) => {
    const success = await handleStatusChange(requestId, 'rejected');
    if (success) {
      // Force reload the component or update state
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-[200px] flex items-center justify-center">
          <p>Loading session requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Session Requests</h2>
        <p className="text-muted-foreground">Manage your incoming session requests from students</p>
      </div>

      <Tabs defaultValue="pending" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <SessionRequestsList 
            requests={sessionRequests} 
            onAccept={handleAccept} 
            onReject={handleReject}
            status="pending"
          />
        </TabsContent>
        
        <TabsContent value="accepted" className="space-y-4">
          <SessionRequestsList 
            requests={sessionRequests} 
            onAccept={handleAccept} 
            onReject={handleReject}
            status="accepted"
          />
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          <SessionRequestsList 
            requests={sessionRequests} 
            onAccept={handleAccept} 
            onReject={handleReject}
            status="rejected"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherSessionRequests;
