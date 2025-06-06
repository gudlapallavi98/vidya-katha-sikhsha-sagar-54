
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

    setIsProcessing(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error("Failed to fetch user profile");

      const customerInfo = {
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Student',
        email: user.email || '',
        phone: '9999999999'
      };

      console.log('Creating payment order with amount:', amount);

      const { data: orderData, error } = await supabase.functions.invoke('cashfree-payment', {
        body: {
          action: 'create_order',
          amount,
          sessionRequestId,
          userId: user.id,
          customerInfo
        }
      });

      if (error || !orderData?.success) {
        console.error('Payment order creation failed:', error, orderData);
        throw new Error(orderData?.error || error?.message || 'Failed to create order');
      }

      console.log('Payment order created successfully:', orderData);

      const orderId = orderData.order_id;
      const paymentUrl = orderData.payment_url;

      if (!paymentUrl) {
        throw new Error('Payment URL not received from gateway');
      }

      // Open payment in the same window instead of new tab
      window.location.href = paymentUrl;

      // Start polling for payment status immediately
      const pollInterval = setInterval(async () => {
        try {
          const { data: verifyData } = await supabase.functions.invoke('cashfree-payment', {
            body: { action: 'verify_payment', order_id: orderId }
          });

          console.log('Payment verification result:', verifyData);

          if (verifyData.success && verifyData.payment_status === 'PAID') {
            clearInterval(pollInterval);
            setIsProcessing(false);
            toast({ title: "Payment Successful" });
            onPaymentSuccess();
          } else if (verifyData.payment_status === 'FAILED') {
            clearInterval(pollInterval);
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

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsProcessing(false);
      }, 300000);

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

    const { error: updateError } = await supabase
      .from("session_requests")
      .update({
        payment_status: "completed",
        status: "pending"
      })
      .eq("id", sessionRequestId);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Mark as Paid Failed",
        description: updateError.message
      });
      return;
    }

    toast({
      title: "Marked as Paid",
      description: "Payment marked as completed. Session moved to pending."
    });
    onPaymentSuccess();
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
              <p>You will be redirected to the payment gateway.</p>
              <p>Please complete the payment to confirm your session.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
