
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
          // Handle redirect if needed
        }

        // Verify payment after checkout
        verifyPaymentStatus(orderData.order_id);
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

  const verifyPaymentStatus = async (orderId: string) => {
    try {
      const { data: verifyData } = await supabase.functions.invoke('cashfree-payment', {
        body: { action: 'verify_payment', order_id: orderId }
      });

      if (verifyData?.success && verifyData.payment_status === 'PAID') {
        setIsProcessing(false);
        toast({ title: "Payment Successful" });
        onPaymentSuccess();
      } else {
        setIsProcessing(false);
        toast({
          variant: "destructive",
          title: "Payment Status Unclear",
          description: "Please check your payment history or contact support.",
        });
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Payment Verification Failed",
        description: "Please contact support for assistance.",
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
