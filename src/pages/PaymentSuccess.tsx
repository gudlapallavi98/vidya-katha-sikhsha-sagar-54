
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("Verifying your payment...");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [paymentData, setPaymentData] = useState<any>(null);

  const verifyPayment = async (orderId: string, attempt = 1) => {
    try {
      console.log(`Verifying payment attempt ${attempt} for order:`, orderId);
      
      // Query payment_history directly using Supabase client
      const { data: paymentHistory, error: paymentError } = await supabase
        .from('payment_history')
        .select(`
          *,
          session_requests(
            id,
            proposed_title,
            status,
            teacher_id,
            student_id
          )
        `)
        .eq('transaction_id', orderId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (paymentError) {
        console.error('Payment verification error:', paymentError);
        throw new Error('Failed to verify payment status');
      }

      if (!paymentHistory || paymentHistory.length === 0) {
        if (attempt < 5) { // Increased retry attempts
          console.log('Payment not found, retrying in 3 seconds...');
          setTimeout(() => verifyPayment(orderId, attempt + 1), 3000);
          return;
        }
        throw new Error('Payment record not found. Please contact support.');
      }

      const payment = paymentHistory[0];
      console.log('Payment found:', payment);
      
      setPaymentData(payment);

      // Check for both 'completed' and 'PAID' status (Cashfree returns 'PAID')
      if (payment.payment_status === 'completed' || 
          (payment.gateway_response && payment.gateway_response.order_status === 'PAID')) {
        setStatus("✅ Payment verified successfully!");
        setIsLoading(false);
        
        // Check if session request needs to be sent to teacher
        if (payment.session_requests && payment.session_requests.status === 'payment_completed') {
          setTimeout(() => {
            setStatus("🎉 Payment successful! Redirecting to confirmation...");
            setTimeout(() => {
              window.location.href = "/student-dashboard?tab=sessions&status=payment_success";
            }, 2000);
          }, 1500);
        } else {
          // Payment completed but request already processed
          setTimeout(() => {
            window.location.href = "/student-dashboard?tab=sessions";
          }, 3000);
        }
      } else if (payment.payment_status === 'pending') {
        setStatus("⏳ Payment is being processed. Please wait...");
        // Retry after 5 seconds for pending payments
        if (attempt < 10) { // Allow more retries for pending
          setTimeout(() => verifyPayment(orderId, attempt + 1), 5000);
        } else {
          setIsLoading(false);
          setError("Payment verification is taking longer than expected. Please contact support.");
        }
      } else if (payment.payment_status === 'failed') {
        setIsLoading(false);
        setError("Payment failed. Please try again or contact support.");
      } else {
        setIsLoading(false);
        setError(`Payment status: ${payment.payment_status}. Please contact support if this persists.`);
      }

    } catch (err: any) {
      console.error("Payment verification error:", err);
      setIsLoading(false);
      setError(err.message || "Failed to verify payment. Please contact support.");
    }
  };

  const handleRetry = () => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    if (orderId && retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setError("");
      setStatus("Retrying payment verification...");
      verifyPayment(orderId);
    }
  };

  const handleContactSupport = () => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    const subject = `Payment Verification Issue - Order ${orderId}`;
    const body = `Hello, I need help with payment verification for Order ID: ${orderId}. The payment was completed but verification failed.`;
    window.location.href = `/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(body)}`;
  };

  const handleGoToDashboard = () => {
    window.location.href = "/student-dashboard?tab=sessions";
  };

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");

    if (!orderId) {
      setError("Missing order ID. Please check your payment confirmation email or contact support.");
      setIsLoading(false);
      return;
    }

    verifyPayment(orderId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            🔔 Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-blue-600 font-medium">{status}</p>
              <p className="text-sm text-gray-600">
                This may take a few moments. Please don't close this page.
              </p>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <p className="text-red-500 font-medium">{error}</p>
              
              {retryCount < 3 && (
                <Button onClick={handleRetry} variant="outline" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Retry Verification
                </Button>
              )}
              
              <Button onClick={handleContactSupport} className="w-full">
                Contact Support
              </Button>
              
              <Button 
                onClick={handleGoToDashboard}
                variant="ghost" 
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <p className="text-green-600 font-medium">{status}</p>
              
              {paymentData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                  <h4 className="font-medium text-green-800 mb-2">Payment Details</h4>
                  <div className="space-y-1 text-green-700">
                    <p><span className="font-medium">Amount:</span> ₹{paymentData.amount}</p>
                    <p><span className="font-medium">Session:</span> {paymentData.session_requests?.proposed_title || 'Session Request'}</p>
                    <p><span className="font-medium">Status:</span> {paymentData.payment_status}</p>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                Your session request will be sent to the teacher for approval.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
