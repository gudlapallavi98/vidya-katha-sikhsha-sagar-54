
import React from 'react';
import { CashfreeUPIForm } from '@/components/payment/CashfreeUPIForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const CashfreeUPIPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Cashfree UPI Payment</h1>
          <p className="text-muted-foreground">
            Send UPI payment requests using Cashfree's UPI Collect API
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CashfreeUPIForm
              onPaymentSuccess={(referenceId) => {
                console.log('Payment successful:', referenceId);
              }}
              onPaymentFailure={(error) => {
                console.error('Payment failed:', error);
              }}
            />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">1. Enter Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the amount and the UPI ID where you want to send the payment request.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">2. Generate Request</h4>
                  <p className="text-sm text-muted-foreground">
                    The system creates a UPI collect request through Cashfree and generates a QR code.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">3. Complete Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    The recipient scans the QR code or clicks the UPI link to complete the payment.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">4. Automatic Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Payment status is automatically updated and verified through Cashfree webhooks.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Real-time payment status updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Secure payment processing via Cashfree
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    QR code generation for easy payments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Automatic webhook notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Payment history tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashfreeUPIPage;
