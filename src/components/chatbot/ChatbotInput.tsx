
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, RotateCcw } from "lucide-react";

interface ChatbotInputProps {
  input: string;
  setInput: (value: string) => void;
  isTyping: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const ChatbotInput: React.FC<ChatbotInputProps> = ({
  input,
  setInput,
  isTyping,
  onSubmit,
  onReset,
}) => {
  return (
    <div className="p-3 bg-white border-t border-gray-200">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="resize-none min-h-[40px] max-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 bg-blue-500 hover:bg-blue-600"
            disabled={!input.trim() || isTyping}
            title="Send message"
          >
            <Send size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9"
            onClick={onReset}
            title="Reset conversation"
          >
            <RotateCcw size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotInput;
