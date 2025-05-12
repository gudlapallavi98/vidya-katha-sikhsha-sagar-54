
import React from "react";
import { cn } from "@/lib/utils";

interface ChatbotMessageProps {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({
  id,
  content,
  role,
  timestamp,
}) => {
  return (
    <div
      key={id}
      className={cn(
        "mb-3 max-w-[85%] p-3 rounded-lg",
        role === "user"
          ? "bg-blue-100 ml-auto rounded-br-none"
          : "bg-white border border-gray-200 mr-auto rounded-bl-none shadow-sm"
      )}
    >
      <p className="text-sm whitespace-pre-wrap">{content}</p>
      <p className="text-xs text-gray-500 mt-1">
        {timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

export default ChatbotMessage;
