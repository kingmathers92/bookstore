"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, X, Minus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  const predefinedQuestions = [
    "How can I track my order?",
    "What is your return policy?",
    "Do you offer international shipping?",
    "How can I contact customer support?",
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !predefinedQuestions.includes(trimmedInput)) {
      toast.error("Please enter a message or select a question!");
      return;
    }
    if (trimmedInput.length > 500) {
      toast.error("Message too long! Please keep it under 500 characters.");
      return;
    }

    const userMessage = { text: trimmedInput, isUser: true, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      let botReply;
      switch (trimmedInput) {
        case "How can I track my order?":
          botReply =
            "You can track your order by logging into your account and visiting the 'Order History' section.";
          break;
        case "What is your return policy?":
          botReply =
            "We offer a 30-day return policy. Items must be unused and in original packaging.";
          break;
        case "Do you offer international shipping?":
          botReply = "No, we offer international shipping.";
          break;
        case "How can I contact customer support?":
          botReply =
            "You can contact us via email at support@thamaratalawrak.com or call us at +123-456-7890.";
          break;
        default:
          botReply =
            "Sorry, I can only answer predefined questions. Please select one from the suggestions!";
      }
      setIsThinking(false);
      setMessages((prev) => [...prev, { text: botReply, isUser: false, timestamp: new Date() }]);
    }, 1000);
  };

  const handleSelectQuestion = (question) => {
    if (messages.length >= 10) {
      toast.warning("Chat limit reached! Please start a new session.");
      return;
    }
    setInput(question);
    handleSend();
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" role="region" aria-label="Live Chat Widget">
      <Button
        className="bg-gold-beige text-cream-100 hover:bg-header-gradient-end rounded-full w-14 h-14 flex items-center justify-center cursor-pointer transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="live-chat-window"
      >
        <MessageSquare />
      </Button>
      {isOpen && (
        <div
          id="live-chat-window"
          className="w-80 h-96 bg-cream-100 p-4 rounded-lg shadow-lg mt-2 border border-gray-200 flex flex-col"
          style={{ backgroundColor: "#F5F5F5" }}
          role="dialog"
          aria-labelledby="live-chat-title"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 id="live-chat-title" className="text-lg font-semibold">
              Live Chat
            </h3>
            <div>
              <Button variant="ghost" size="sm" onClick={handleClose} aria-label="Close chat">
                <X size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize chat"
                className="ml-2"
              >
                <Minus size={16} />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2" aria-live="polite">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.isUser ? "bg-primary text-white self-end" : "bg-gray-200 text-foreground"
                } max-w-[70%]`}
              >
                <span>{msg.text}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            {isThinking && (
              <div className="p-2 text-foreground flex items-center">
                <span className="dot-flashing"></span>
                <span className="dot-flashing" style={{ animationDelay: "0.2s" }}></span>
                <span className="dot-flashing" style={{ animationDelay: "0.4s" }}></span>
                <span className="ml-2">Thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              {predefinedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectQuestion(question)}
                  className="text-foreground hover:bg-gray-200"
                  disabled={isThinking || messages.length >= 10}
                  aria-label={`Ask ${question}`}
                >
                  {question}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 focus-visible:ring-primary"
                placeholder="Type your message or select a question..."
                aria-label="Chat input"
                maxLength={500}
              />
              <Button
                onClick={handleSend}
                className="bg-primary text-white hover:bg-primary/90"
                aria-label="Send message"
                disabled={
                  isThinking ||
                  (!input.trim() && !predefinedQuestions.includes(input)) ||
                  messages.length >= 10
                }
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
