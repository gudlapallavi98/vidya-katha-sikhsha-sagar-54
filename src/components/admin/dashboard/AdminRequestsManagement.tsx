import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminSessionRequest } from "@/components/types/admin";
import { acceptSessionRequest, rejectSessionRequest } from "@/api/dashboard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Check, X, Search, BookOpen, Calendar } from "lucide-react";

const AdminRequestsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: sessionRequests = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin_session_requests', searchQuery, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('session_requests')
        .select(`
          id,
          proposed_title,
          request_message,
          proposed_date,
          proposed_duration,
          status,
          created_at,
          student:profiles!session_requests_student_id_fkey(id, first_name, last_name),
          teacher:profiles!session_requests_teacher_id_fkey(id, first_name, last_name)
        `);
      
      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`proposed_title.ilike.%${searchQuery}%`);
      }
      
      // Order by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as AdminSessionRequest[];
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching session requests",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }, [error, toast]);

  const handleAccept = async (requestId: string) => {
    try {
      await acceptSessionRequest(requestId);
      toast({
        title: "Request Accepted",
        description: "Session has been created successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept request",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectSessionRequest(requestId);
      toast({
        title: "Request Rejected",
        description: "Session request has been rejected.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject request",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Session Requests</h1>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Session Requests Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Loading requests...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4 text-red-500">
              <p>An error occurred while fetching session requests</p>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : sessionRequests.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.proposed_title}
                </TableCell>
                <TableCell>
                  {request.student.first_name} {request.student.last_name}
                </TableCell>
                <TableCell>
                  {request.teacher.first_name} {request.teacher.last_name}
                </TableCell>
                <TableCell>
                  {format(new Date(request.proposed_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell className="text-right">
                  {request.status === 'pending' ? (
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAccept(request.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReject(request.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm">View</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-medium">No Requests Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            {searchQuery || statusFilter !== "all" ? 
              "No session requests match your search criteria. Try different filters." :
              "There are no session requests in the system yet."}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminRequestsManagement;
