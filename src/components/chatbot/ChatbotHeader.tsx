
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, MinusCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatbotHeaderProps {
  isMinimized: boolean;
  requestId: string | null;
  toggleMinimize: () => void;
  toggleChat: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({
  isMinimized,
  requestId,
  toggleMinimize,
  toggleChat,
}) => {
  return (
    <div className="bg-blue-500 p-3 text-white flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 bg-blue-300">
          <MessageSquare size={16} className="text-blue-700" />
        </Avatar>
        <div>
          <h3 className="font-medium">etutorss Assistant</h3>
          {requestId && (
            <p className="text-xs opacity-90">Request ID: {requestId}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white hover:bg-blue-400 rounded-full"
          onClick={toggleMinimize}
          title={isMinimized ? "Expand" : "Minimize"}
        >
          <MinusCircle size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white hover:bg-blue-400 rounded-full"
          onClick={toggleChat}
          title="Close"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotHeader;
