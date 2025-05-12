
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessageList from "./ChatbotMessageList";
import ChatbotInput from "./ChatbotInput";
import { useChatbot } from "./hooks/useChatbot";

const Chatbot = () => {
  const {
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
  } = useChatbot();

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
          <ChatbotHeader
            isMinimized={isMinimized}
            requestId={requestId}
            toggleMinimize={toggleMinimize}
            toggleChat={toggleChat}
          />

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <ChatbotMessageList
                messages={messages}
                isTyping={isTyping}
                chatbotState={chatbotState}
                formValues={formValues}
                formErrors={formErrors}
                isSubmitting={chatbotState === "submitting"}
                requestId={requestId}
                onFormChange={handleFormChange}
                onFormSubmit={handleSubmit}
                onBackToChat={() => setChatbotState("chat")}
              />

              {/* Input Area - Only show if not in form or completed state */}
              {chatbotState === "chat" && (
                <ChatbotInput
                  input={input}
                  setInput={setInput}
                  isTyping={isTyping}
                  onSubmit={handleSubmit}
                  onReset={resetChat}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
