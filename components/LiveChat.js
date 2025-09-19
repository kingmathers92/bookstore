"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, X, Minus } from "lucide-react";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setIsThinking(false);
      if (data.reply) {
        setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { text: data.error, isUser: false }]);
      }
    } catch (error) {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not connect to chat", isUser: false },
      ]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="bg-gold-beige text-cream-100 hover:bg-header-gradient-end rounded-full w-14 h-14 flex items-center justify-center cursor-pointer" // Cursor pointer on hover
        onClick={() => setIsOpen(!isOpen)}
        aria-label="فتح الدردشة المباشرة"
      >
        <MessageSquare />
      </Button>
      {isOpen && (
        <div
          className="w-80 h-96 bg-cream-100 p-4 rounded-lg shadow-lg mt-2 border border-gray-200 flex flex-col"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Live Chat</h3>
            <div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="ml-2"
              >
                <Minus size={16} />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.isUser
                    ? "bg-primary text-white self-end"
                    : "bg-gray-200 text-foreground"
                } max-w-[70%]`}
              >
                <span>{msg.text}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            ))}
            {isThinking && (
              <div className="p-2 text-foreground">
                <span className="dot-flashing"></span>
                <span
                  className="dot-flashing"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="dot-flashing"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 focus-visible:ring-primary"
              placeholder="Type your message..."
            />
            <Button onClick={handleSend} className="bg-primary text-white">
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
