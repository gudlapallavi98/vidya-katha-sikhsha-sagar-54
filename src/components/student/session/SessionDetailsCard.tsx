
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/pricingUtils";

interface SessionDetailsCardProps {
  type: 'individual' | 'course';
  availability: any;
  pricing: {
    teacherRate: number;
    platformFee: number;
    studentAmount: number;
  };
}

export const SessionDetailsCard: React.FC<SessionDetailsCardProps> = ({
  type,
  availability,
  pricing
}) => {
  // Format display date for UI
  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Type:</span>
            <p className="text-sm text-muted-foreground">
              {type === 'individual' ? 'Individual Session' : 'Course Enrollment'}
            </p>
          </div>
          <div>
            <span className="font-medium">Subject/Course:</span>
            <p className="text-sm text-muted-foreground">
              {type === 'individual' ? availability.subject?.name : availability.title}
            </p>
          </div>
          {type === 'individual' && (
            <>
              <div>
                <span className="font-medium">Date:</span>
                <p className="text-sm text-muted-foreground">
                  {formatDisplayDate(availability.available_date)}
                </p>
              </div>
              <div>
                <span className="font-medium">Time:</span>
                <p className="text-sm text-muted-foreground">
                  {availability.start_time} - {availability.end_time} IST
                </p>
              </div>
            </>
          )}
          <div className="col-span-2">
            <span className="font-medium">Payment Details:</span>
            <div className="mt-2 bg-green-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Teacher Rate:</span>
                <span>{formatCurrency(pricing.teacherRate)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Platform Fee (10%):</span>
                <span>+{formatCurrency(pricing.platformFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-600 border-t pt-2 mt-2">
                <span>Amount Paid:</span>
                <span>{formatCurrency(pricing.studentAmount)} ✓ Paid</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
