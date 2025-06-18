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

  const verifyAndUpdatePaymentStatus = async (orderId: string, attempt = 1) => {
    try {
      console.log(`Verifying payment attempt ${attempt} for order:`, orderId);
      
      // First, verify payment status with Cashfree
      const { data: verificationResult, error: verifyError } = await supabase.functions.invoke('cashfree-payment', {
        body: {
          action: 'verify_payment',
          order_id: orderId
        }
      });

      if (verifyError) {
        console.error('Payment verification error:', verifyError);
        throw new Error('Failed to verify payment with Cashfree');
      }

      console.log('Cashfree verification result:', verificationResult);

      // Check if this is a course enrollment payment
      if (orderId.startsWith('COURSE_')) {
        const orderParts = orderId.split('_');
        const courseId = orderParts[1];
        const studentId = orderParts[2];

        if (verificationResult?.success && verificationResult?.payment_status === 'PAID') {
          console.log('Course payment verified, creating enrollment...');
          
          // Create enrollment directly
          const { error: enrollmentError } = await supabase
            .from('enrollments')
            .insert({
              student_id: studentId,
              course_id: courseId,
              enrolled_at: new Date().toISOString(),
              completed_lessons: 0,
              last_accessed_at: new Date().toISOString()
            });

          if (enrollmentError) {
            console.error('Error creating enrollment:', enrollmentError);
          } else {
            console.log('Enrollment created successfully');
          }

          setStatus("🎉 Payment successful! You have been enrolled in the course.");
          setIsLoading(false);
          
          // Auto-redirect to student dashboard after 3 seconds
          setTimeout(() => {
            window.location.href = "/student-dashboard?tab=courses&status=enrollment_success";
          }, 3000);
          return;
        }
      }

      // For other payment types, get the payment record from database
      const { data: paymentHistory, error: paymentError } = await supabase
        .from('payment_history')
        .select(`
          *,
          session_requests(
            id,
            proposed_title,
            status,
            payment_status,
            teacher_id,
            student_id
          )
        `)
        .eq('transaction_id', orderId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (paymentError) {
        console.error('Database query error:', paymentError);
        throw new Error('Failed to fetch payment record');
      }

      if (!paymentHistory || paymentHistory.length === 0) {
        if (attempt < 8) {
          console.log('Payment record not found, retrying in 3 seconds...');
          setTimeout(() => verifyAndUpdatePaymentStatus(orderId, attempt + 1), 3000);
          return;
        }
        throw new Error('Payment record not found. Please contact support.');
      }

      const payment = paymentHistory[0];
      console.log('Payment record found:', payment);
      
      setPaymentData(payment);

      // Check if payment is completed in Cashfree and our database
      const isCashfreeSuccess = verificationResult?.success && verificationResult?.payment_status === 'PAID';
      const isDbCompleted = payment.payment_status === 'completed';

      if (isCashfreeSuccess && isDbCompleted) {
        // Payment is verified as successful, now automatically send to teacher
        if (payment.session_requests) {
          const sessionRequest = payment.session_requests;
          
          // Auto-update session request to pending (send to teacher) if payment is completed
          if (sessionRequest.payment_status === 'completed' && sessionRequest.status === 'payment_completed') {
            console.log('Auto-sending request to teacher...');
            
            const { error: updateError } = await supabase
              .from('session_requests')
              .update({ 
                status: 'pending',
                updated_at: new Date().toISOString()
              })
              .eq('id', sessionRequest.id);

            if (updateError) {
              console.error('Error auto-updating session request:', updateError);
            } else {
              console.log('Session request automatically sent to teacher');
            }
          }
        }

        setStatus("🎉 Payment successful! Your request has been sent to the teacher.");
        setIsLoading(false);
        
        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = "/student-dashboard?tab=sessions&status=payment_success";
        }, 3000);
        
      } else if (payment.payment_status === 'pending' || !isCashfreeSuccess) {
        setStatus("⏳ Payment is being processed. Please wait...");
        
        // Retry for pending payments
        if (attempt < 12) {
          setTimeout(() => verifyAndUpdatePaymentStatus(orderId, attempt + 1), 4000);
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
      
      if (attempt < 5) {
        console.log('Retrying due to error...');
        setTimeout(() => verifyAndUpdatePaymentStatus(orderId, attempt + 1), 5000);
      } else {
        setIsLoading(false);
        setError(err.message || "Failed to verify payment. Please contact support.");
      }
    }
  };

  const handleRetry = () => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    if (orderId && retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setError("");
      setStatus("Retrying payment verification...");
      verifyAndUpdatePaymentStatus(orderId);
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

    verifyAndUpdatePaymentStatus(orderId);
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
                Automatically verifying with Cashfree and updating status...
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
                    <p><span className="font-medium">Status:</span> Completed</p>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                Redirecting to your dashboard...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
