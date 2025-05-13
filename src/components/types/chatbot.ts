
export type FormField = {
  name: string;
  email: string;
  phone: string;
  city: string;
  description: string;
};

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export type ChatbotState = "chat" | "form" | "submitting" | "completed";

export interface KnowledgeBase {
  [key: string]: string;
}
