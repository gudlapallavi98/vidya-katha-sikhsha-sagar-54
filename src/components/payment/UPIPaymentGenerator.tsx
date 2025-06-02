
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CashfreeUPIForm } from "./CashfreeUPIForm";

export default function UPIPaymentGenerator() {
  const [price, setPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'manual' | 'cashfree'>('manual');
  const [paymentDetails, setPaymentDetails] = useState<{
    studentAmount: number;
    teacherPayout: number;
    upiLink: string;
    qrCodeUrl: string;
  } | null>(null);

  const { toast } = useToast();

  const generatePayment = () => {
    if (price <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0",
      });
      return;
    }

    const studentAmount = Math.round(price * 1.1 * 100) / 100; // 10% platform fee
    const teacherPayout = Math.round(price * 0.9 * 100) / 100; // Teacher gets 90%

    const upiLink = `upi://pay?pa=q546190808@ybl&pn=Etutorss&am=${studentAmount}&tn=Payment for course&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

    setPaymentDetails({
      studentAmount,
      teacherPayout,
      upiLink,
      qrCodeUrl,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const openUPILink = () => {
    if (paymentDetails) {
      window.open(paymentDetails.upiLink, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💳 UPI Payment Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="manual"
                  checked={paymentMethod === 'manual'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'manual' | 'cashfree')}
                />
                <span>Manual UPI (Static QR)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="cashfree"
                  checked={paymentMethod === 'cashfree'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'manual' | 'cashfree')}
                />
                <span>Cashfree UPI Collect</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'manual' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="price">Course Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="Enter course price"
                  value={price || ""}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                />
              </div>

              <Button onClick={generatePayment} className="w-full">
                Generate Payment Details
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {paymentMethod === 'cashfree' && (
        <Card>
          <CardHeader>
            <CardTitle>Cashfree UPI Collect</CardTitle>
          </CardHeader>
          <CardContent>
            <CashfreeUPIForm
              onPaymentSuccess={(referenceId) => {
                toast({
                  title: "Payment Successful",
                  description: `Payment completed with reference: ${referenceId}`,
                });
              }}
              onPaymentFailure={(error) => {
                toast({
                  variant: "destructive",
                  title: "Payment Failed",
                  description: error,
                });
              }}
            />
          </CardContent>
        </Card>
      )}

      {paymentDetails && paymentMethod === 'manual' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">💰 Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-green-800">
                  📌 Student Payment: ₹{paymentDetails.studentAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  (Includes 10% platform fee)
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-blue-800">
                  💵 Teacher Receives: ₹{paymentDetails.teacherPayout.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  (After 10% platform fee)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="font-medium">🔗 UPI Payment Link:</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(paymentDetails.upiLink)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openUPILink}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
              
              <div className="p-3 bg-white rounded border break-all text-sm">
                {paymentDetails.upiLink}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <p className="font-medium">📷 QR Code:</p>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={paymentDetails.qrCodeUrl}
                  alt="UPI Payment QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Students can scan this QR code with any UPI app to make payment
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Payment Details:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• UPI ID: q546190808@ybl</li>
                <li>• Payee: Etutorss</li>
                <li>• Amount: ₹{paymentDetails.studentAmount.toFixed(2)}</li>
                <li>• Note: Payment for course</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
