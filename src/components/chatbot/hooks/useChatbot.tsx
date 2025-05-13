
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message, ChatbotState } from "../../types/chatbot";
import { generateResponse } from "../utils/responseGenerator";
import { useChatbotForm } from "./useChatbotForm";

const initialMessages: Message[] = [
  {
    id: "welcome-message",
    content:
      "Hello! Welcome to etutorss. I'm here to help you with any questions about our courses, teachers, or how to get started with online tutoring. How can I assist you today?",
    role: "assistant",
    timestamp: new Date(),
  },
];

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatbotState, setChatbotState] = useState<ChatbotState>("chat");
  const [user, setUser] = useState<any>(null);
  
  const { toast } = useToast();

  // Add assistant message helper function
  const addAssistantMessage = (content: string) => {
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      content,
      role: "assistant",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const {
    formValues,
    formErrors,
    requestId,
    handleFormChange,
    handleFormSubmit,
    initializeForm
  } = useChatbotForm(user, setChatbotState, addAssistantMessage);

  useEffect(() => {
    // Get current auth state
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      initializeForm();
    };
    
    fetchUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          initializeForm();
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (chatbotState === "form") {
      handleFormSubmit();
      return;
    }
    
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

    // Check if user is asking for help or contact
    const inputLower = input.trim().toLowerCase();
    if (
      inputLower.includes("speak to someone") || 
      inputLower.includes("talk to someone") || 
      inputLower.includes("contact") || 
      inputLower.includes("help me") || 
      inputLower.includes("need help") ||
      inputLower.includes("request") ||
      inputLower.includes("human") ||
      inputLower.includes("support")
    ) {
      // Simulate typing delay before showing contact form
      setTimeout(() => {
        addAssistantMessage("I'll be happy to connect you with our support team. Please fill out this quick form with your details:");
        setIsTyping(false);
        setChatbotState("form");
      }, 1000);
      
      return;
    }

    // Regular chatbot response
    setTimeout(() => {
      const response = generateResponse(input.trim().toLowerCase(), user);
      addAssistantMessage(response);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay between 500ms and 1500ms for more natural feel
  };

  const resetChat = () => {
    setMessages(initialMessages);
    setChatbotState("chat");
    setFormValues({
      name: "",
      email: user?.email || "",
      phone: "",
      city: "",
      description: "",
    });
    setFormErrors({});
    
    toast({
      title: "Chat Reset",
      description: "The conversation has been reset."
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return {
    isOpen,
    isMinimized,
    messages,
    input,
    isTyping,
    chatbotState,
    formValues,
    formErrors,
    requestId,
    handleSubmit,
    setInput,
    handleFormChange,
    resetChat,
    toggleChat,
    toggleMinimize,
    setChatbotState,
  };
};
