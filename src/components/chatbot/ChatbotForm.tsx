
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, FileText, Send, Loader2 } from "lucide-react";

interface ChatbotFormProps {
  formValues: {
    name: string;
    email: string;
    phone: string;
    city: string;
    description: string;
  };
  formErrors: Partial<Record<keyof any, string>>;
  isSubmitting: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToChat: () => void;
}

const ChatbotForm: React.FC<ChatbotFormProps> = ({
  formValues,
  formErrors,
  isSubmitting,
  onFormChange,
  onSubmit,
  onBackToChat,
}) => {
  const renderFormField = (
    fieldName: "name" | "email" | "phone" | "city",
    label: string,
    type: string = "text",
    placeholder: string,
    icon: React.ReactNode,
    required: boolean = false
  ) => {
    return (
      <div className="space-y-1">
        <Label htmlFor={fieldName} className="flex items-center text-sm gap-2">
          {icon}
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={fieldName}
          name={fieldName}
          type={type}
          value={formValues[fieldName]}
          onChange={onFormChange}
          placeholder={placeholder}
          className={formErrors[fieldName] ? "border-red-500" : ""}
          disabled={isSubmitting}
          required={required}
        />
        {formErrors[fieldName] && (
          <p className="text-xs text-red-500 mt-1">{formErrors[fieldName]}</p>
        )}
      </div>
    );
  };

  return (
    <form className="space-y-4 p-1" onSubmit={onSubmit}>
      {renderFormField(
        "name",
        "Full Name",
        "text",
        "John Doe",
        <User size={16} />,
        true
      )}

      {renderFormField(
        "email",
        "Email Address",
        "email",
        "your@email.com",
        <Mail size={16} />,
        true
      )}

      {renderFormField(
        "phone",
        "Phone Number",
        "tel",
        "+91 98765 43210",
        <Phone size={16} />
      )}

      {renderFormField(
        "city",
        "City",
        "text",
        "Mumbai",
        <MapPin size={16} />
      )}

      <div className="space-y-1">
        <Label htmlFor="description" className="flex items-center text-sm gap-2">
          <FileText size={16} />
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formValues.description}
          onChange={onFormChange}
          placeholder="Please describe your query or issue in detail..."
          className={`resize-none min-h-[80px] ${
            formErrors.description ? "border-red-500" : ""
          }`}
          disabled={isSubmitting}
          required
        />
        {formErrors.description && (
          <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBackToChat}
          disabled={isSubmitting}
        >
          Back to Chat
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChatbotForm;
