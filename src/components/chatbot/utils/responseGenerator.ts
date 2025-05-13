
import { KnowledgeBase } from "../../types/chatbot";
import { knowledgeBase } from "../data/knowledgeBase";

export const generateResponse = (query: string, user: any): string => {
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
