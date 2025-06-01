
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CreditCard, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { calculatePricing, formatCurrency } from '@/utils/pricingUtils';

interface PaymentQRGeneratorProps {
  availability: any;
  type: 'individual' | 'course';
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const PaymentQRGenerator: React.FC<PaymentQRGeneratorProps> = ({
  availability,
  type,
  onPaymentSuccess,
  onBack
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const { toast } = useToast();

  // Get teacher rate from availability
  const teacherRate = type === 'individual' 
    ? (availability.price || availability.teacher_rate || 100)
    : (availability.price || availability.teacher_rate || 500);

  // Calculate pricing with platform fee
  const pricing = calculatePricing(teacherRate);
  const title = type === 'individual' ? availability.subject?.name : availability.title;

  // Dynamic UPI payment details
  const upiId = "q546190808@ybl";
  const payeeName = "Etutorss";
  const note = `Payment for ${title} - ${type} session`;
  
  // Generate dynamic UPI payment URL
  const generateUPIUrl = () => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${pricing.studentAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Generate dynamic QR code URL using QR Server API
  const generateQRCodeUrl = () => {
    const upiUrl = generateUPIUrl();
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  };

  // Check payment status periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (paymentStatus === 'pending' && !isProcessing) {
      // Check payment status every 5 seconds
      intervalId = setInterval(() => {
        checkPaymentStatus();
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentStatus, isProcessing]);

  const checkPaymentStatus = async () => {
    if (isCheckingPayment) return;
    
    setIsCheckingPayment(true);
    
    try {
      // In a real implementation, you would call your payment gateway API
      // For now, we'll simulate payment checking
      console.log("Checking payment status...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll randomly succeed after some time
      // In production, this should check with your actual payment provider
      const shouldSucceed = Math.random() > 0.7; // 30% chance of success per check
      
      if (shouldSucceed) {
        setPaymentStatus('success');
        toast({
          title: "Payment Confirmed!",
          description: `Payment of ${formatCurrency(pricing.studentAmount)} has been confirmed`,
        });
        
        // Auto-proceed after success
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setPaymentStatus('failed');
      toast({
        variant: "destructive",
        title: "Payment Check Failed",
        description: "Unable to verify payment status. Please try again.",
      });
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const copyUPIDetails = () => {
    const upiDetails = `UPI ID: ${upiId}\nPayee: ${payeeName}\nAmount: ${formatCurrency(pricing.studentAmount)}\nNote: ${note}`;
    navigator.clipboard.writeText(upiDetails);
    toast({
      title: "UPI Details Copied",
      description: "UPI payment details copied to clipboard",
    });
  };

  const copyUPILink = () => {
    const upiUrl = generateUPIUrl();
    navigator.clipboard.writeText(upiUrl);
    toast({
      title: "UPI Link Copied",
      description: "UPI payment link copied to clipboard",
    });
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      setIsProcessing(false);
      
      toast({
        title: "Payment Successful",
        description: `Payment of ${formatCurrency(pricing.studentAmount)} completed successfully`,
      });
      
      // Auto-proceed after success
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    }, 3000);
  };

  const handleRetryPayment = () => {
    setPaymentStatus('pending');
    toast({
      title: "Payment Reset",
      description: "You can now try making the payment again",
    });
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
          <p className="text-muted-foreground mt-2">
            Your payment of {formatCurrency(pricing.studentAmount)} has been confirmed.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Proceeding to session request form...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-20 w-20 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
          <p className="text-muted-foreground mt-2">
            We couldn't confirm your payment. Please try again.
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={handleRetryPayment}>
            Try Again
          </Button>
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Service:</span>
            <span>{title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Type:</span>
            <Badge variant={type === 'individual' ? 'default' : 'secondary'}>
              {type === 'individual' ? 'Individual Session' : 'Course'}
            </Badge>
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span>Teacher Rate:</span>
              <span>{formatCurrency(pricing.teacherRate)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Platform Fee (10%):</span>
              <span>+{formatCurrency(pricing.platformFee)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total Amount:</span>
              <span className="text-blue-600">{formatCurrency(pricing.studentAmount)}</span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-blue-800">
              💡 <strong>Pricing Info:</strong> Teacher gets {formatCurrency(pricing.teacherPayout)} after 10% platform fee
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan QR Code to Pay
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-white p-4 rounded-lg inline-block border">
            <img 
              src={generateQRCodeUrl()} 
              alt="Dynamic UPI Payment QR Code" 
              className="w-48 h-48"
              onError={(e) => {
                console.error("QR code failed to load");
                e.currentTarget.src = "/lovable-uploads/31156744-7366-422f-9d37-73ca828727c0.png";
              }}
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with any UPI app to make payment
            </p>
            {isCheckingPayment && (
              <p className="text-xs text-blue-600 animate-pulse">
                🔄 Checking payment status...
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => window.open(generateUPIUrl(), '_blank')}
            >
              Pay with UPI App
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={copyUPILink}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy UPI Link
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={copyUPIDetails}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Details
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing Payment..." : "Mark as Paid (Test)"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Payment Instructions:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
            <li>• Scan the QR code above</li>
            <li>• Verify amount: {formatCurrency(pricing.studentAmount)}</li>
            <li>• Complete the payment</li>
            <li>• We'll automatically detect your payment and proceed</li>
          </ul>
          
          <div className="mt-3 p-2 bg-white rounded border">
            <p className="text-xs font-medium">UPI Details:</p>
            <p className="text-xs">ID: {upiId}</p>
            <p className="text-xs">Name: {payeeName}</p>
            <p className="text-xs">Amount: {formatCurrency(pricing.studentAmount)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
