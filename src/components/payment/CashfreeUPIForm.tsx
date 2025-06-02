
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Loader2, CheckCircle, XCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CashfreeUPIFormProps {
  onPaymentSuccess?: (referenceId: string) => void;
  onPaymentFailure?: (error: string) => void;
}

export const CashfreeUPIForm: React.FC<CashfreeUPIFormProps> = ({
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [amount, setAmount] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [referenceId, setReferenceId] = useState<string>('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();

  const validateUpiId = (upi: string) => {
    // Basic UPI ID validation pattern
    const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiPattern.test(upi);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
      });
      return;
    }

    if (!upiId || !validateUpiId(upiId)) {
      toast({
        variant: "destructive",
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (e.g., user@paytm)",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('cashfree-upi-collect', {
        body: {
          amount: parseFloat(amount),
          upiId: upiId.trim(),
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setPaymentData(data);
        setReferenceId(data.reference_id);
        setPaymentStatus('pending');
        
        toast({
          title: "UPI Collect Request Created",
          description: `Reference ID: ${data.reference_id}`,
        });

        // Start polling for payment status
        startStatusPolling(data.reference_id);
      } else {
        throw new Error(data.error || 'Failed to create UPI collect request');
      }
    } catch (error) {
      console.error('UPI collect error:', error);
      toast({
        variant: "destructive",
        title: "Payment Request Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      setPaymentStatus('failed');
      onPaymentFailure?.(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusPolling = (refId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        setIsCheckingStatus(true);
        const { data, error } = await supabase.functions.invoke('cashfree-upi-collect', {
          body: null,
          method: 'GET'
        });

        if (error) {
          console.error('Status check error:', error);
          return;
        }

        const status = data.status?.toLowerCase();
        
        if (status === 'paid' || status === 'success') {
          setPaymentStatus('success');
          clearInterval(pollInterval);
          toast({
            title: "Payment Successful!",
            description: `Payment of ₹${amount} completed successfully`,
          });
          onPaymentSuccess?.(refId);
        } else if (status === 'failed' || status === 'cancelled') {
          setPaymentStatus('failed');
          clearInterval(pollInterval);
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "The UPI payment was not completed",
          });
          onPaymentFailure?.('Payment failed or cancelled');
        }
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (paymentStatus === 'pending') {
        toast({
          variant: "destructive",
          title: "Payment Timeout",
          description: "Payment verification timed out. Please check manually.",
        });
      }
    }, 10 * 60 * 1000);
  };

  const generateQRCodeUrl = (upiUri: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} Copied`,
      description: `${label} copied to clipboard`,
    });
  };

  const resetForm = () => {
    setAmount('');
    setUpiId('');
    setPaymentData(null);
    setPaymentStatus('idle');
    setReferenceId('');
  };

  if (paymentStatus === 'success') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-green-600">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your payment of ₹{amount} has been completed successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Reference ID: {referenceId}
            </p>
            <Button onClick={resetForm} className="w-full">
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-red-600">Payment Failed</h3>
            <p className="text-muted-foreground">
              Your payment could not be completed. Please try again.
            </p>
            <Button onClick={resetForm} className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'pending' && paymentData) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Complete Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Amount: ₹{amount}</p>
            <p className="text-sm text-muted-foreground">To: {upiId}</p>
            <p className="text-xs text-muted-foreground">Ref: {referenceId}</p>
          </div>

          {paymentData.upi_uri && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block border">
                <img 
                  src={generateQRCodeUrl(paymentData.upi_uri)} 
                  alt="UPI Payment QR Code" 
                  className="w-48 h-48"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Scan QR code with any UPI app or click below
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => window.open(paymentData.upi_uri, '_blank')}
                    className="flex-1"
                  >
                    Pay with UPI App
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(paymentData.upi_uri, 'UPI Link')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {isCheckingStatus && (
                <p className="text-xs text-blue-600 animate-pulse">
                  🔄 Checking payment status...
                </p>
              )}
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={resetForm}
            className="w-full"
          >
            Cancel Payment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cashfree UPI Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              type="text"
              placeholder="user@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the UPI ID where you want to send the payment request
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Payment Request...
              </>
            ) : (
              'Create UPI Payment Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
