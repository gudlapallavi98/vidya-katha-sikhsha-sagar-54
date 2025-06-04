
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

// Updated comprehensive knowledge base for the chatbot
const knowledgeBase: Record<string, string> = {
  "hello": "Hello! How can I help you today with etutorss?",
  "hi": "Hi there! What questions do you have about etutorss?",
  "courses": "At etutorss, we offer courses in various subjects including Mathematics, Science, Languages, Literature, History, Geography, and specialized exam preparation. Each course is taught by experienced educators who are experts in their fields. You can explore our complete course catalog by clicking 'Explore Courses' on our homepage.",
  "teachers": "Our teachers are experienced professionals with expertise in their subject areas. They undergo a thorough verification process before joining our platform, ensuring you receive quality education. You can view teacher profiles to see their qualifications, experience, and student ratings.",
  "price": "Course pricing varies based on subject, duration, and teacher expertise. Individual sessions typically range from ₹300 to ₹1500 per hour. Package deals offering multiple sessions come with discounts. You can view detailed pricing on each course page.",
  "payment": "We use a simplified UPI payment system for all transactions. When you enroll in a course or book a session, you'll receive a UPI payment link or QR code that you can use with any UPI app like GPay, PhonePe, or Paytm. All payments are secure and include a 10% platform fee.",
  "upi": "We accept UPI payments through all major UPI apps including Google Pay, PhonePe, Paytm, BHIM, and others. Simply scan the QR code or use the UPI link provided during checkout to complete your payment securely.",
  "registration": "Registration is easy! Click on the 'Sign Up' button in the top right corner, fill in your details, verify your email, and you'll be ready to start your learning journey. The process takes less than 5 minutes.",
  "login": "You can log in using the 'Login' button on the top right of the page. If you've forgotten your password, there's an option to reset it using your registered email address.",
  "contact": "You can reach our support team through the contact form on our website, email us directly at support@etutorss.com, or use the live chat feature during business hours (9 AM to 6 PM IST).",
  "schedule": "Classes can be scheduled directly with teachers based on mutual availability. Our platform makes it easy to find suitable time slots. Once confirmed, you'll receive email notifications and calendar invites.",
  "subjects": "We offer a wide range of subjects including Mathematics (Algebra, Calculus, Geometry), Sciences (Physics, Chemistry, Biology), Languages (English, Hindi, Sanskrit), Humanities, Coding, and specialized entrance exam preparation.",
  "exams": "We offer specialized coaching for competitive exams including JEE, NEET, UPSC, CAT, GMAT, GRE, and various state-level entrance tests. Our expert coaches provide targeted preparation strategies and regular mock tests.",
  "duration": "Course durations vary based on the subject and your learning goals. We offer flexible options from single one-hour sessions to comprehensive multi-month courses. You can discuss your specific requirements with our teachers.",
  "refund": "We have a student-friendly refund policy. If you're not satisfied with your first session, you can request a full refund within 24 hours. For package deals, unused sessions can be refunded on a pro-rata basis.",
  "certificate": "Yes, etutorss provides course completion certificates for all full courses. These certificates detail the course content, duration, and your achievements, which can be added to your professional profile.",
  "technical": "For technical issues, please try refreshing your browser, clearing cache, or using another supported browser (Chrome, Firefox, Safari). If problems persist, contact our support team at support@etutorss.com with details of the issue.",
  "account": "You can manage your account by clicking on your profile picture at the top right corner and selecting 'Account Settings'. From there, you can update your profile, change your password, and view your learning history.",
  "benefits": "Learning with etutorss gives you access to qualified teachers, flexible scheduling, personalized attention, interactive learning tools, and comprehensive study materials. Our platform is designed to make learning engaging and effective.",
  "materials": "Course materials are provided digitally through our platform. Depending on the course, these may include lecture notes, practice problems, video tutorials, interactive exercises, and recommended readings.",
  "group": "Yes, we offer both one-on-one and small group sessions. Group sessions are more affordable and foster collaborative learning. The maximum group size is typically 5-6 students to ensure everyone receives adequate attention.",
  "demo": "We offer free consultation sessions with teachers before you commit to a course. This gives you a chance to assess the teaching style and determine if it's the right fit for your learning needs.",
  "languages": "Our platform supports teaching in multiple languages including English, Hindi, and several regional Indian languages. You can filter teachers based on your preferred language of instruction.",
  "reviews": "You can find student reviews on each teacher's profile. After completing a course, you'll be invited to leave your own review to help future students make informed decisions.",
  "difference": "What sets etutorss apart is our thorough teacher verification process, interactive learning platform with advanced tools, personalized learning paths, flexible scheduling options, and comprehensive progress tracking. We focus on quality education that adapts to your specific needs.",
  "student dashboard": "The student dashboard provides access to your scheduled sessions, learning materials, progress reports, messaging with teachers, and payment history. It's your central hub for managing all aspects of your learning journey.",
  "teacher dashboard": "The teacher dashboard allows educators to manage their course offerings, schedule, student interactions, teaching materials, and earnings. It provides tools for effective online teaching and student progress tracking.",
  "explore": "You can explore our courses by clicking the 'Explore Courses' button on our homepage or by navigating to the courses section. There you'll find detailed information about all available subjects, teachers, and pricing options.",
  "homepage": "Our homepage has been updated with a cleaner design. You can now easily explore courses using the 'Explore Courses' button, which will take you directly to our course catalog where you can browse all available subjects and teachers."
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get current auth state
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    fetchUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
      const response = generateResponse(input.trim().toLowerCase(), user);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay between 500ms and 1500ms for more natural feel
  };

  const generateResponse = (query: string, user: any): string => {
    // Personalized greeting if user is logged in
    if ((query.includes("hello") || query.includes("hi")) && user) {
      return `Hello ${user.user_metadata?.first_name || "there"}! How can I help you with etutorss today?`;
    }

    // Check if query contains multiple topics and provide combined response
    const topics = Object.keys(knowledgeBase);
    const matchedTopics: string[] = [];
    
    // Find all topics that match the query
    topics.forEach(topic => {
      if (query.includes(topic)) {
        matchedTopics.push(topic);
      }
    });
    
    // If multiple topics match, combine their responses
    if (matchedTopics.length > 1) {
      let combinedResponse = "";
      matchedTopics.forEach((topic, index) => {
        combinedResponse += knowledgeBase[topic];
        if (index < matchedTopics.length - 1) {
          combinedResponse += "\n\n";
        }
      });
      return combinedResponse;
    }
    
    // Check for single keyword matches
    for (const [keyword, response] of Object.entries(knowledgeBase)) {
      if (query.includes(keyword)) {
        return response;
      }
    }
    
    // Check for question types
    if (query.includes("how") && query.includes("start")) {
      return "To get started with etutorss, first sign up for an account using the 'Sign Up' button at the top right. Then, you can browse available courses by clicking 'Explore Courses' on our homepage, select one that matches your needs, and schedule your first session. If you need any help, our support team is available to assist you.";
    }
    
    if (query.includes("how") && query.includes("pay")) {
      return "You can pay for courses using UPI through any UPI app like Google Pay, PhonePe, or Paytm. The payment process is simple: select your course, proceed to checkout, and you'll receive a UPI payment link or QR code. All transactions are secure and include a 10% platform fee.";
    }
    
    // Default responses based on query context
    if (query.includes("thank")) {
      return "You're welcome! Feel free to ask if you have any other questions about etutorss.";
    }
    
    if (query.includes("bye") || query.includes("goodbye")) {
      return "Goodbye! Feel free to return whenever you have questions about etutorss. Have a great day!";
    }

    // Default responses if no keywords match
    const defaultResponses = [
      "Thanks for your question. To provide more specific help, could you please provide more details about what you're looking for?",
      "I understand you have a question about that. For the most accurate information, you might want to check our FAQ section or contact our support team through the contact form.",
      "That's an interesting question. At etutorss, we strive to provide comprehensive educational solutions. Could you elaborate a bit more so I can give you a more specific answer?",
      "Thank you for your interest in etutorss. We'd be happy to help you with any specific questions about our courses, teachers, or platform features. You can also explore our courses directly by clicking 'Explore Courses' on our homepage."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const resetChat = () => {
    setMessages(initialMessages);
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                      onClick={resetChat}
                      title="Reset conversation"
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
