
import React, { useEffect, useRef } from "react";
import { Check, Loader2 } from "lucide-react";
import ChatbotMessage from "./ChatbotMessage";
import ChatbotForm from "./ChatbotForm";
import { FormField } from "../types/chatbot";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatbotMessageListProps {
  messages: Message[];
  isTyping: boolean;
  chatbotState: "chat" | "form" | "submitting" | "completed";
  formValues: FormField;
  formErrors: Partial<Record<keyof FormField, string>>;
  isSubmitting: boolean;
  requestId: string | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onBackToChat: () => void;
}

const ChatbotMessageList: React.FC<ChatbotMessageListProps> = ({
  messages,
  isTyping,
  chatbotState,
  formValues,
  formErrors,
  isSubmitting,
  requestId,
  onFormChange,
  onFormSubmit,
  onBackToChat,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatbotState, isTyping]);

  return (
    <div className="p-3 h-[390px] overflow-y-auto bg-gray-50">
      {messages.map((message) => (
        <ChatbotMessage 
          key={message.id}
          id={message.id}
          content={message.content}
          role={message.role}
          timestamp={message.timestamp}
        />
      ))}
      
      {isTyping && (
        <div className="flex gap-2 items-center text-gray-500 mb-3 p-3 max-w-[85%] bg-white border border-gray-200 mr-auto rounded-lg rounded-bl-none">
          <div className="flex gap-1">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse delay-100">●</span>
            <span className="animate-pulse delay-200">●</span>
          </div>
          <span className="text-xs">etutorss Assistant is typing</span>
        </div>
      )}
      
      {chatbotState === "form" && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 my-3 shadow-sm">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            Contact Form
          </h4>
          <ChatbotForm 
            formValues={formValues}
            formErrors={formErrors}
            isSubmitting={isSubmitting}
            onFormChange={onFormChange}
            onSubmit={onFormSubmit}
            onBackToChat={onBackToChat}
          />
        </div>
      )}
      
      {chatbotState === "completed" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-3">
          <h4 className="font-medium mb-1 text-green-700 flex items-center gap-2">
            <Check size={16} className="text-green-500" />
            Request Submitted Successfully
          </h4>
          <p className="text-sm text-green-600">
            Request ID: <span className="font-mono font-medium">{requestId}</span>
          </p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatbotMessageList;
