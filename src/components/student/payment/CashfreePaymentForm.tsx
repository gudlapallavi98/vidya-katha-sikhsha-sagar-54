
import React, { useState, useEffect } from "react";
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

// Load Cashfree Checkout script
const loadCashfreeCheckout = () => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(window.Cashfree);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

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

  // Listen for payment success message from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message:', event.data);
      
      if (event.data?.type === 'payment_success') {
        console.log('Payment success message received from popup');
        setIsProcessing(false);
        
        if (event.data.confirmed) {
          // User confirmed to send request to teacher
          handleSendRequestToTeacher();
        } else {
          // Just payment success without confirmation
          toast({
            title: "Payment Successful!",
            description: "Please confirm to send your session request to the teacher.",
          });
        }
      } else if (event.data?.type === 'payment_failed') {
        console.log('Payment failed message received from popup');
        setIsProcessing(false);
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again.",
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast, sessionRequestId]);

  const handleSendRequestToTeacher = async () => {
    try {
      // Update session request status to pending for teacher approval
      const { error } = await supabase
        .from('session_requests')
        .update({
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionRequestId);

      if (error) {
        console.error('Error updating session request status:', error);
        throw error;
      }

      toast({
        title: "Request Sent Successfully!",
        description: "Your session request has been sent to the teacher for approval. You will be notified once they respond.",
      });

      // Navigate to sessions tab
      setTimeout(() => {
        window.location.href = '/student-dashboard?tab=sessions';
      }, 2000);

    } catch (error) {
      console.error('Error sending request to teacher:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send request to teacher. Please try again.",
      });
    }
  };

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

      // Load Cashfree Checkout SDK
      await loadCashfreeCheckout();

      // Initialize Cashfree with production environment
      const cashfree = window.Cashfree({
        mode: "production" // Use production mode
      });

      // Configure checkout options
      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        returnUrl: `https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/cashfree-payment?action=payment_return&order_id=${orderData.order_id}`,
      };

      console.log('Initiating Cashfree checkout with options:', checkoutOptions);

      // Open Cashfree checkout
      cashfree.checkout(checkoutOptions).then((result: any) => {
        console.log('Checkout result:', result);
        
        if (result.error) {
          console.error('Checkout error:', result.error);
          toast({
            variant: "destructive",
            title: "Payment Error",
            description: result.error.message || "Payment failed. Please try again.",
          });
          setIsProcessing(false);
          return;
        }

        if (result.redirect) {
          console.log('Payment redirect:', result.redirect);
          // Payment window will handle the redirect and send message back
        }

        // The payment result will be handled by the message listener
      }).catch((error: any) => {
        console.error('Checkout initiation error:', error);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "Failed to open payment window. Please try again.",
        });
        setIsProcessing(false);
      });

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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Refund Policy</h4>
            <p className="text-sm text-yellow-700">
              If the teacher rejects your session request, the full amount will be automatically refunded to your account within 3-5 business days.
            </p>
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

          {isProcessing && (
            <div className="text-center text-sm text-gray-600">
              <p>Please complete the payment in the Cashfree checkout window.</p>
              <p>This page will automatically update once payment is completed.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
