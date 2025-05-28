
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp } from "lucide-react";

const EarningsTab: React.FC = () => {
  const { user } = useAuth();

  const { data: earnings = [], isLoading } = useQuery({
    queryKey: ['teacher_earnings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_earnings')
        .select(`
          *,
          sessions(title, start_time)
        `)
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: paymentHistory = [] } = useQuery({
    queryKey: ['teacher_payment_history', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_history')
        .select(`
          *,
          session_requests(proposed_title, teacher_id),
          sessions(title, teacher_id)
        `)
        .or(`session_requests.teacher_id.eq.${user?.id},sessions.teacher_id.eq.${user?.id}`)
        .eq('payment_type', 'student_payment')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalEarnings = earnings.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
  const confirmedEarnings = earnings
    .filter(e => e.status === 'confirmed')
    .reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
  const pendingEarnings = earnings
    .filter(e => e.status === 'pending')
    .reduce((sum, earning) => sum + parseFloat(earning.amount), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reverted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading earnings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Earnings & Payments</h2>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            ₹{totalEarnings.toFixed(2)} total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{confirmedEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{pendingEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Earnings Yet</h3>
              <p className="text-muted-foreground">
                Your earnings from completed sessions will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Release Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell>
                      {new Date(earning.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {earning.sessions?.title || 'Session'}
                      </div>
                      {earning.sessions?.start_time && (
                        <div className="text-sm text-muted-foreground">
                          {new Date(earning.sessions.start_time).toLocaleDateString('en-IN')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{parseFloat(earning.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(earning.status)}>
                        {earning.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {earning.release_date ? 
                        new Date(earning.release_date).toLocaleDateString('en-IN') : 
                        '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {paymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student Payments Received</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Student Paid</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Your Share</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      {payment.session_requests?.proposed_title || payment.sessions?.title || 'Session'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      -₹{payment.platform_fee.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{payment.teacher_payout.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.payment_status)}>
                        {payment.payment_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EarningsTab;
