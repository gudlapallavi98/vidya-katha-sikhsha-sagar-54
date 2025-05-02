
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import SessionRequestSearch from "@/components/teacher/SessionRequestSearch";
import { SessionRequest } from "@/hooks/types";

interface TeacherSessionRequestsProps {
  sessionRequests: SessionRequest[];
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
  return (
    <>
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Session Requests</h1>
      <Card>
        <CardContent className="p-6">
          {/* Add search component */}
          <SessionRequestSearch onSearch={handleSearch} />
          
          {requestsLoading ? (
            <div className="text-center py-8">Loading session requests...</div>
          ) : sessionRequests.length > 0 ? (
            <div className="space-y-6">
              {sessionRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{request.proposed_title}</h3>
                        <p className="text-muted-foreground">
                          From {request.student?.first_name} {request.student?.last_name}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded">
                          Pending
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Course</p>
                        <p className="font-medium">{request.course?.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Proposed Date</p>
                        <p className="font-medium">
                          {new Date(request.proposed_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Proposed Time</p>
                        <p className="font-medium">
                          {new Date(request.proposed_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })} 
                          {` (${request.proposed_duration} min)`}
                        </p>
                      </div>
                    </div>
                    
                    {request.request_message && (
                      <div>
                        <p className="text-sm text-muted-foreground">Message</p>
                        <p className="bg-muted p-3 rounded mt-1">{request.request_message}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-4 mt-2">
                      <Button 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleRejectSession(request.id)}
                      >
                        <X className="h-4 w-4 mr-2" /> Decline
                      </Button>
                      <Button 
                        className="bg-indian-green"
                        onClick={() => handleAcceptSession(request.id)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Accept
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "No matching session requests found." : "You don't have any pending session requests."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TeacherSessionRequests;
