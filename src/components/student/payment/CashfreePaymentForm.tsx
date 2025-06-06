
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/pricingUtils";

interface CashfreePaymentFormProps {
  availability: any;
  type: 'individual' | 'course';
  sessionRequestId: string;
  amount: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const CashfreePaymentForm: React.FC<CashfreePaymentFormProps> = ({
  availability,
  type,
  sessionRequestId,
  amount,
  onPaymentSuccess,
  onBack
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to proceed with payment.",
      });
      return;
    }

    if (!sessionRequestId) {
      toast({
        variant: "destructive",
        title: "Session Request Missing",
        description: "Please try again.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw new Error("Failed to fetch user profile");
      }

      const customerInfo = {
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Student',
        email: user.email || '',
        phone: '9999999999'
      };

      console.log('Creating payment order with:', { amount, sessionRequestId, customerInfo });

      const { data: orderData, error } = await supabase.functions.invoke('cashfree-payment', {
        body: {
          action: 'create_order',
          amount,
          sessionRequestId,
          userId: user.id,
          customerInfo
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to invoke payment function');
      }

      if (!orderData?.success) {
        console.error('Payment order creation failed:', orderData);
        throw new Error(orderData?.error || 'Failed to create payment order');
      }

      console.log('Payment order created successfully:', orderData);

      const paymentUrl = orderData.payment_url;
      if (!paymentUrl) {
        throw new Error('Payment URL not received from gateway');
      }

      // Open payment in popup window
      const paymentWindow = window.open(
        paymentUrl,
        'payment',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      if (!paymentWindow) {
        // Fallback: redirect in same window if popup is blocked
        window.location.href = paymentUrl;
        return;
      }

      // Poll for payment completion
      const pollInterval = setInterval(async () => {
        try {
          // Check if payment window is closed
          if (paymentWindow.closed) {
            clearInterval(pollInterval);
            setIsProcessing(false);
            
            // Verify payment status
            const { data: verifyData } = await supabase.functions.invoke('cashfree-payment', {
              body: { action: 'verify_payment', order_id: orderData.order_id }
            });

            if (verifyData?.success && verifyData.payment_status === 'PAID') {
              toast({ title: "Payment Successful" });
              onPaymentSuccess();
            } else {
              toast({
                variant: "destructive",
                title: "Payment Status Unclear",
                description: "Please check your payment history or contact support.",
              });
            }
            return;
          }

          // Also check payment status while window is open
          const { data: verifyData } = await supabase.functions.invoke('cashfree-payment', {
            body: { action: 'verify_payment', order_id: orderData.order_id }
          });

          if (verifyData?.success && verifyData.payment_status === 'PAID') {
            clearInterval(pollInterval);
            paymentWindow.close();
            setIsProcessing(false);
            toast({ title: "Payment Successful" });
            onPaymentSuccess();
          } else if (verifyData?.payment_status === 'FAILED') {
            clearInterval(pollInterval);
            paymentWindow.close();
            setIsProcessing(false);
            toast({
              variant: "destructive",
              title: "Payment Failed",
              description: "Your payment was not successful. Please try again.",
            });
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);

      // Stop polling after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (!paymentWindow.closed) {
          paymentWindow.close();
        }
        setIsProcessing(false);
      }, 600000);

    } catch (error: any) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error?.message || "Failed to initiate payment. Please try again.",
      });
    }
  };

  const handleTestPayment = async () => {
    if (!user || !sessionRequestId) return;

    setIsProcessing(true);
    try {
      const { error: updateError } = await supabase
        .from("session_requests")
        .update({
          payment_status: "completed",
          status: "pending"
        })
        .eq("id", sessionRequestId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Payment Marked as Completed",
        description: "Session request moved to pending status."
      });
      onPaymentSuccess();
    } catch (error: any) {
      console.error("Test payment error:", error);
      toast({
        variant: "destructive",
        title: "Test Payment Failed",
        description: error.message || "Failed to mark payment as completed."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">Complete Payment</h2>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <CreditCard className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-lg font-medium">Secure Payment</h3>
            <p className="text-sm text-gray-600">
              Complete your payment to confirm the session booking
            </p>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Session Type:</span>
              <span className="capitalize">{type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Subject:</span>
              <span>{availability?.subject?.name || availability?.title || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Duration:</span>
              <span>{availability?.duration || 60} minutes</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total Amount:</span>
              <span className="text-green-600">{formatCurrency(amount)}</span>
            </div>
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay {formatCurrency(amount)}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleTestPayment}
            disabled={isProcessing}
            className="w-full"
          >
            ✅ Mark as Paid (Test)
          </Button>

          {isProcessing && (
            <div className="text-center text-sm text-gray-600">
              <p>A payment window will open. Please complete the payment there.</p>
              <p>This page will automatically update once payment is completed.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
