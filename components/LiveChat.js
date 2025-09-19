"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, X } from "lucide-react";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { text: data.error, isUser: false }]);
      }
    } catch (error) {
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
        className="bg-gold-beige text-cream-100 hover:bg-header-gradient-end rounded-full w-14 h-14 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="فتح الدردشة المباشرة"
      >
        <MessageSquare />
      </Button>
      {isOpen && (
        <div className="w-80 h-96 bg-cream-100 p-4 rounded-lg shadow-lg mt-2 border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Live Chat</h3>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X size={16} />
            </Button>
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
                {msg.text}
              </div>
            ))}
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
