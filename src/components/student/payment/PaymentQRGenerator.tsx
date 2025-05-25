
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, CreditCard, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const amount = type === 'individual' ? 500 : 2000;
  const title = type === 'individual' ? availability.subject?.name : availability.title;

  // Generate UPI payment URL
  const generateUPIUrl = () => {
    const upiId = "teacher@paytm"; // Replace with actual UPI ID
    const payeeName = "Etutorss";
    const note = `Payment for ${title}`;
    
    return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Generate QR code data URL (simplified representation)
  const generateQRCode = () => {
    const upiUrl = generateUPIUrl();
    // In a real implementation, you would use a QR code library
    // For now, we'll create a simple visual representation
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="10" y="10" width="20" height="20" fill="black"/>
        <rect x="40" y="10" width="20" height="20" fill="black"/>
        <rect x="70" y="10" width="20" height="20" fill="black"/>
        <rect x="10" y="40" width="20" height="20" fill="black"/>
        <rect x="70" y="40" width="20" height="20" fill="black"/>
        <rect x="10" y="70" width="20" height="20" fill="black"/>
        <rect x="40" y="70" width="20" height="20" fill="black"/>
        <rect x="70" y="70" width="20" height="20" fill="black"/>
        <text x="100" y="100" font-family="Arial" font-size="12" fill="black">UPI Payment</text>
        <text x="100" y="120" font-family="Arial" font-size="10" fill="black">₹${amount}</text>
        <text x="100" y="140" font-family="Arial" font-size="8" fill="black">${title}</text>
      </svg>
    `)}`;
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      setIsProcessing(false);
      
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
              src={generateQRCode()} 
              alt="Payment QR Code" 
              className="w-48 h-48"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with any UPI app to make payment
            </p>
            <p className="text-xs text-muted-foreground">
              Or click the button below to open your UPI app
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => window.open(generateUPIUrl(), '_blank')}
            >
              Pay with UPI App
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing Payment..." : "Simulate Payment (Test)"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
