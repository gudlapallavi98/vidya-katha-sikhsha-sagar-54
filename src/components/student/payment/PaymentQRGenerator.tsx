
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
    const upiId = "teacher@paytm";
    const payeeName = "Etutorss";
    const note = `Payment for ${title}`;
    
    return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Generate QR code data URL using a simple pattern approach
  const generateQRCode = () => {
    // Create a simple placeholder QR-like pattern using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 200);
      
      // Draw simple QR-like pattern
      ctx.fillStyle = 'black';
      
      // Corner markers
      const drawCornerMarker = (x: number, y: number) => {
        ctx.fillRect(x, y, 30, 30);
        ctx.fillStyle = 'white';
        ctx.fillRect(x + 5, y + 5, 20, 20);
        ctx.fillStyle = 'black';
        ctx.fillRect(x + 10, y + 10, 10, 10);
      };
      
      drawCornerMarker(10, 10);
      drawCornerMarker(160, 10);
      drawCornerMarker(10, 160);
      
      // Random pattern for data
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(50 + i * 5, 50 + j * 5, 4, 4);
          }
        }
      }
      
      // Add text
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText('UPI Payment', 60, 90);
      ctx.fillText(`₹${amount}`, 75, 110);
    }
    
    return canvas.toDataURL();
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
