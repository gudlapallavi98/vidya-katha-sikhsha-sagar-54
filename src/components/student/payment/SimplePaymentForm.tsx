
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface SimplePaymentFormProps {
  availability: any;
  type: 'individual' | 'course';
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({
  availability,
  type,
  onPaymentSuccess,
  onBack
}) => {
  const handlePaymentSuccess = () => {
    // Simulate payment completion
    onPaymentSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">Payment</h2>
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Details</h3>
          <p className="text-sm text-gray-600">
            Payment functionality will be implemented with new payment gateway.
          </p>
          
          <div className="space-y-2">
            <p><strong>Session Type:</strong> {type}</p>
            <p><strong>Subject:</strong> {availability?.subject || 'N/A'}</p>
            <p><strong>Duration:</strong> {availability?.duration || 'N/A'} minutes</p>
          </div>
          
          <Button onClick={handlePaymentSuccess} className="w-full">
            Proceed (Payment Integration Coming Soon)
          </Button>
        </div>
      </Card>
    </div>
  );
};
