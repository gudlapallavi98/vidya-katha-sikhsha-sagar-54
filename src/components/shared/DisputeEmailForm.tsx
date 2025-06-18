
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DisputeEmailFormProps {
  sessionId: string;
  sessionTitle: string;
  otherPartyName: string;
  userType: 'teacher' | 'student';
}

const DisputeEmailForm: React.FC<DisputeEmailFormProps> = ({
  sessionId,
  sessionTitle,
  otherPartyName,
  userType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmitDispute = async () => {
    if (!disputeReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for the dispute",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send dispute email via edge function
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/dispute-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          sessionTitle,
          disputeReason,
          reporterEmail: user?.email,
          reporterType: userType,
          otherPartyName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send dispute email");
      }

      toast({
        title: "Dispute Reported",
        description: "Your dispute has been reported and an email has been sent to the support team.",
      });

      setIsOpen(false);
      setDisputeReason("");
    } catch (error) {
      console.error("Error sending dispute email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send dispute report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Report Session Issue
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Session: <strong>{sessionTitle}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              {userType === 'teacher' ? 'Student' : 'Teacher'}: <strong>{otherPartyName}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispute-reason">Describe the issue</Label>
            <Textarea
              id="dispute-reason"
              placeholder="Please provide details about the issue you experienced with this session..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitDispute}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeEmailForm;
