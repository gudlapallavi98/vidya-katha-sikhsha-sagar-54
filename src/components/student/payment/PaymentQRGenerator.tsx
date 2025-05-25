
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CreditCard, CheckCircle, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const amount = type === 'individual' ? 500 : 2000;
  const title = type === 'individual' ? availability.subject?.name : availability.title;

  // Dynamic UPI payment details
  const upiId = "q546190808@ybl";
  const payeeName = "Etutorss";
  const note = `Payment for ${title} - ${type} session`;
  
  // Generate dynamic UPI payment URL
  const generateUPIUrl = () => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Generate dynamic QR code URL using QR Server API
  const generateQRCodeUrl = () => {
    const upiUrl = generateUPIUrl();
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  };

  const copyUPIDetails = () => {
    const upiDetails = `UPI ID: ${upiId}\nPayee: ${payeeName}\nAmount: ₹${amount}\nNote: ${note}`;
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
        description: `Payment of ₹${amount} completed successfully`,
      });
      
      // Auto-proceed after success
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    }, 3000);
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
            Your payment of ₹{amount} has been processed successfully.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Redirecting to session request form...
          </p>
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
            Payment Details
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
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount:</span>
            <span>₹{amount}</span>
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
            <p className="text-xs text-muted-foreground">
              Or use the options below for manual payment
            </p>
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
            <li>• Verify amount: ₹{amount}</li>
            <li>• Complete the payment</li>
            <li>• Return here to continue with session request</li>
          </ul>
          
          <div className="mt-3 p-2 bg-white rounded border">
            <p className="text-xs font-medium">UPI Details:</p>
            <p className="text-xs">ID: {upiId}</p>
            <p className="text-xs">Name: {payeeName}</p>
            <p className="text-xs">Amount: ₹{amount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
