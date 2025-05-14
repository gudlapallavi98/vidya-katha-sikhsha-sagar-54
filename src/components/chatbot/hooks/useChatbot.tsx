
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { FormField } from "../../types/chatbot";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type ChatbotState = "chat" | "form" | "submitting" | "completed";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(10, "Please provide more details about your query"),
});

const initialMessages: Message[] = [
  {
    id: "welcome-message",
    content:
      "Hello! Welcome to etutorss. I'm here to help you with any questions about our courses, teachers, or how to get started with online tutoring. How can I assist you today?",
    role: "assistant",
    timestamp: new Date(),
  },
];

// Comprehensive knowledge base for the chatbot
const knowledgeBase: Record<string, string> = {
  "hello": "Hello! How can I help you today with etutorss?",
  "hi": "Hi there! What questions do you have about etutorss?",
  "courses": "At etutorss, we offer courses in various subjects including Mathematics, Science, Languages, Literature, History, Geography, and specialized exam preparation. Each course is taught by experienced educators who are experts in their fields.",
  "teachers": "Our teachers are experienced professionals with expertise in their subject areas. They undergo a thorough verification process before joining our platform, ensuring you receive quality education. You can view teacher profiles to see their qualifications, experience, and student ratings.",
  "price": "Course pricing varies based on subject, duration, and teacher expertise. Individual sessions typically range from ₹300 to ₹1500 per hour. Package deals offering multiple sessions come with discounts. You can view detailed pricing on each course page.",
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
  "account": "You can manage your account by clicking on your profile picture at the top right corner and selecting 'Account Settings'. From there, you can update your profile, change your password, manage payment methods, and view your learning history.",
  "payment": "We accept various payment methods including credit/debit cards, UPI, net banking, and popular digital wallets. All payments are processed securely through our payment gateway with industry-standard encryption.",
  "benefits": "Learning with etutorss gives you access to qualified teachers, flexible scheduling, personalized attention, interactive learning tools, and comprehensive study materials. Our platform is designed to make learning engaging and effective.",
  "materials": "Course materials are provided digitally through our platform. Depending on the course, these may include lecture notes, practice problems, video tutorials, interactive exercises, and recommended readings.",
  "group": "Yes, we offer both one-on-one and small group sessions. Group sessions are more affordable and foster collaborative learning. The maximum group size is typically 5-6 students to ensure everyone receives adequate attention.",
  "demo": "Yes, we offer free 15-minute demo sessions with teachers before you commit to a course. This gives you a chance to assess the teaching style and determine if it's the right fit for your learning needs.",
  "languages": "Our platform supports teaching in multiple languages including English, Hindi, and several regional Indian languages. You can filter teachers based on your preferred language of instruction.",
  "reviews": "You can find student reviews on each teacher's profile. After completing a course, you'll be invited to leave your own review to help future students make informed decisions.",
  "difference": "What sets etutorss apart is our thorough teacher verification process, interactive learning platform with advanced tools, personalized learning paths, flexible scheduling options, and comprehensive progress tracking. We focus on quality education that adapts to your specific needs.",
  "student dashboard": "The student dashboard provides access to your scheduled sessions, learning materials, progress reports, messaging with teachers, and payment history. It's your central hub for managing all aspects of your learning journey.",
  "teacher dashboard": "The teacher dashboard allows educators to manage their course offerings, schedule, student interactions, teaching materials, and earnings. It provides tools for effective online teaching and student progress tracking.",
};

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatbotState, setChatbotState] = useState<ChatbotState>("chat");
  const [formValues, setFormValues] = useState<FormField>({
    name: "",
    email: "",
    phone: "",
    city: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormField, string>>>({});
  const [requestId, setRequestId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Get current auth state
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      // Pre-fill email if user is logged in
      if (data.user?.email) {
        setFormValues(prev => ({
          ...prev,
          email: data.user.email || "",
          name: data.user?.user_metadata?.first_name 
            ? `${data.user.user_metadata.first_name} ${data.user.user_metadata.last_name || ""}`
            : prev.name
        }));
      }
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
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: "I'll be happy to connect you with our support team. Please fill out this quick form with your details:",
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        setChatbotState("form");
      }, 1000);
      
      return;
    }

    // Regular chatbot response
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (formErrors[name as keyof FormField]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Validate form
      const validationResult = formSchema.safeParse(formValues);
      
      if (!validationResult.success) {
        const errors: Partial<Record<keyof FormField, string>> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0] as keyof FormField] = err.message;
          }
        });
        
        setFormErrors(errors);
        return;
      }
      
      // Start submission process
      setChatbotState("submitting");
      
      // Generate a request ID
      const { data: reqIdData, error: reqIdError } = await supabase.rpc('generate_request_id');
      
      if (reqIdError) {
        throw new Error(`Error generating request ID: ${reqIdError.message}`);
      }
      
      const generatedRequestId = reqIdData;
      
      // Save to database
      const { error: insertError } = await supabase
        .from('chatbot_requests')
        .insert([{ 
          request_id: generatedRequestId,
          ...formValues
        }]);
      
      if (insertError) {
        throw new Error(`Error saving request: ${insertError.message}`);
      }
      
      setRequestId(generatedRequestId);
      
      // Send acknowledgment email
      const emailResponse = await supabase.functions.invoke('send-request-acknowledgment', {
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          requestId: generatedRequestId,
        }),
      });
      
      if (!emailResponse.data?.success) {
        console.warn("Email sending failed, but request was recorded", emailResponse.error);
      }
      
      // Add confirmation message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: `Thank you, ${formValues.name}! Your request has been submitted successfully. Your request ID is: ${generatedRequestId}. We've sent a confirmation email to ${formValues.email} with these details. Our team will get back to you soon!`,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setChatbotState("completed");
      
      // Reset form for future use
      setFormValues({
        name: "",
        email: user?.email || "",
        phone: "",
        city: "",
        description: "",
      });
      
      toast({
        title: "Request Submitted",
        description: `Your request ID is: ${generatedRequestId}`,
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      // Add error message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: "I'm sorry, there was an error submitting your request. Please try again later or contact support directly at support@etutorss.com.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setChatbotState("chat");
      
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: "There was a problem submitting your request. Please try again.",
        duration: 5000,
      });
    }
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
      return "To get started with etutorss, first sign up for an account using the 'Sign Up' button at the top right. Then, you can browse available courses or teachers, select one that matches your needs, and schedule your first session. If you need any help, our support team is available to assist you.";
    }
    
    if (query.includes("how") && query.includes("pay")) {
      return "You can pay for courses using credit/debit cards, UPI, net banking, or popular digital wallets. The payment process is simple: select your course, click on 'Enroll', and follow the payment instructions. All transactions are secure and encrypted.";
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
      "Thank you for your interest in etutorss. We'd be happy to help you with any specific questions about our courses, teachers, or platform features."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
    setRequestId(null);
    
    toast({
      title: "Chat Reset",
      description: "The conversation has been reset.",
      duration: 3000,
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
