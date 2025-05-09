
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  MinusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "welcome-message",
    content:
      "Hello! Welcome to etutorss. I'm here to help you with any questions about our courses, teachers, or how to get started with online tutoring. How can I assist you today?",
    role: "assistant",
    timestamp: new Date(),
  },
];

const sampleResponses: Record<string, string> = {
  "hello": "Hello! How can I help you today?",
  "hi": "Hi there! What questions do you have about etutorss?",
  "courses": "At etutorss, we offer courses in various subjects including Mathematics, Science, Languages, and more. Each course is taught by experienced educators.",
  "teachers": "Our teachers are experienced professionals with expertise in their subject areas. They undergo a thorough verification process before joining our platform.",
  "price": "Course pricing varies based on subject, duration, and teacher expertise. You can view detailed pricing on each course page.",
  "registration": "Registration is easy! Click on the 'Sign Up' button in the top right corner, fill in your details, and you'll be ready to start your learning journey.",
  "login": "You can log in using the 'Login' button on the top right of the page. If you've forgotten your password, there's an option to reset it.",
  "contact": "You can reach our support team through the contact form on our website, or email us directly at support@etutorss.com.",
  "schedule": "Classes can be scheduled directly with teachers based on mutual availability. Our platform makes it easy to find suitable time slots.",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(input.trim().toLowerCase());
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(sampleResponses)) {
      if (query.includes(keyword)) {
        return response;
      }
    }

    // Default responses if no keywords match
    const defaultResponses = [
      "Thanks for your question. To provide more specific help, could you please provide more details?",
      "That's an interesting question. Our team is constantly working to improve our services. For more specific assistance, you might want to check our FAQ section.",
      "I understand you have a question about that. For the most accurate information, I'd recommend reaching out to our support team through the contact form.",
      "Thank you for your interest in etutorss. We'd be happy to help you with any specific questions about our courses or teaching methods."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const resetChat = () => {
    setMessages(initialMessages);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "rounded-full h-14 w-14 shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out",
            isMinimized ? "h-14" : "h-[500px] max-h-[70vh]"
          )}
        >
          {/* Chat Header */}
          <div className="bg-blue-500 p-3 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-blue-300">
                <MessageSquare size={16} className="text-blue-700" />
              </Avatar>
              <div>
                <h3 className="font-medium">etutorss Assistant</h3>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-blue-400 rounded-full"
                onClick={toggleMinimize}
              >
                <MinusCircle size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-blue-400 rounded-full"
                onClick={toggleChat}
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="p-3 h-[390px] overflow-y-auto bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "mb-3 max-w-[85%] p-3 rounded-lg",
                      message.role === "user"
                        ? "bg-blue-100 ml-auto rounded-br-none"
                        : "bg-white border border-gray-200 mr-auto rounded-bl-none shadow-sm"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
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
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="resize-none min-h-[40px] max-h-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      size="icon"
                      className="h-9 w-9 bg-blue-500 hover:bg-blue-600"
                      disabled={!input.trim()}
                    >
                      <Send size={16} />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-9 w-9"
                      onClick={resetChat}
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
