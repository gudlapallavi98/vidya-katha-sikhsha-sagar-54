
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, DollarSign, Download, FileText } from "lucide-react";
import { generateInvoicePDF } from "@/utils/invoiceGenerator";
import { useToast } from "@/hooks/use-toast";

const PaymentHistoryTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: paymentHistory = [], isLoading } = useQuery({
    queryKey: ['payment_history', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_history')
        .select(`
          *,
          session_requests(proposed_title, status),
          sessions(title)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refund_initiated':
        return 'bg-blue-100 text-blue-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'refund_initiated':
        return 'Refund Initiated';
      case 'refunded':
        return 'Refunded';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getNotes = (payment: any) => {
    if (payment.payment_status === 'refund_initiated') {
      return 'Refund initiated - Teacher rejected the session request. Refund will be processed within 3-5 business days.';
    }
    if (payment.payment_status === 'refunded') {
      return 'Refund completed - Amount has been credited back to your account.';
    }
    if (payment.payment_status === 'failed') {
      return 'Payment failed - Please try again or contact support.';
    }
    if (payment.payment_status === 'completed') {
      return 'Payment successful - Session request sent to teacher.';
    }
    return payment.notes || 'Payment processing';
  };

  const handleDownloadInvoice = (payment: any) => {
    if (payment.payment_status !== 'completed') {
      toast({
        variant: "destructive",
        title: "Invoice Not Available",
        description: "Invoice can only be downloaded for completed payments.",
      });
      return;
    }

    try {
      generateInvoicePDF(payment);
      toast({
        title: "Invoice Downloaded",
        description: "Your invoice is being generated and will open shortly.",
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to generate invoice. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading payment history...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {paymentHistory.length} transactions
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Payment History</h3>
              <p className="text-muted-foreground">
                Your payment transactions will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {payment.session_requests?.proposed_title || payment.sessions?.title || 'Session'}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      ₹{payment.platform_fee.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.payment_status)}>
                        {getStatusText(payment.payment_status)}
                      </Badge>
                      {payment.payment_status === 'refund_initiated' && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Refund will be processed within 3-5 business days
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="uppercase">
                      {payment.payment_method}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-48">
                      <div className="truncate" title={getNotes(payment)}>
                        {getNotes(payment)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(payment)}
                        disabled={payment.payment_status !== 'completed'}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        <FileText className="h-3 w-3" />
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistoryTab;
