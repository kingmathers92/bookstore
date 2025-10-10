"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, X, Minus } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/sonner";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  const { language } = useStore();

  const translations = {
    en: {
      title: "Live Chat",
      placeholder: "Type your message or select a question...",
      questions: [
        "How can I track my order?",
        "What is your return policy?",
        "Do you offer international shipping?",
        "How can I contact customer support?",
      ],
      responses: {
        "How can I track my order?":
          "You can track your order by logging into your account and visiting the 'Order History' section.",
        "What is your return policy?":
          "We offer a 30-day return policy. Items must be unused and in original packaging.",
        "Do you offer international shipping?":
          "Yes, we offer international shipping. Shipping costs and times vary by region.",
        "How can I contact customer support?":
          "You can contact us via email at support@thamaratalawrak.com or call us at +123-456-7890.",
        default:
          "Sorry, I can only answer predefined questions. Please select one from the suggestions!",
      },
    },
    ar: {
      title: "الدردشة المباشرة",
      placeholder: "اكتب رسالتك أو اختر سؤالاً...",
      questions: [
        "كيف يمكنني تتبع طلبيتي؟",
        "ما هي سياسة الإرجاع؟",
        "هل تقدمون شحنًا دوليًا؟",
        "كيف يمكنني التواصل مع الدعم الفني؟",
      ],
      responses: {
        "كيف يمكنني تتبع طلبيتي؟":
          "يمكنك تتبع طلبيتك من خلال تسجيل الدخول إلى حسابك وزيارة قسم 'سجل الطلبات'.",
        "ما هي سياسة الإرجاع؟":
          "نقدم سياسة إرجاع لمدة 30 يومًا. يجب أن تكون المنتجات غير مستخدمة وفي عبوتها الأصلية.",
        "هل تقدمون شحنًا دوليًا؟": "نعم، نقدم الشحن الدولي. تختلف التكاليف والأوقات حسب المنطقة.",
        "كيف يمكنني التواصل مع الدعم الفني؟":
          "يمكنك التواصل معنا عبر البريد الإلكتروني support@thamaratalawrak.com أو الاتصال على +123-456-7890.",
        default:
          "عذرًا، يمكنني الإجابة فقط على الأسئلة المحددة مسبقًا. يرجى اختيار واحدة من الاقتراحات!",
      },
    },
  };

  const { title, placeholder, questions, responses } = translations[language] || translations.en;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !questions.includes(trimmedInput)) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال رسالة أو اختيار سؤال!"
          : "Please enter a message or select a question!",
      );
      return;
    }
    if (trimmedInput.length > 500) {
      toast.error(
        language === "ar"
          ? "الرسالة طويلة جدًا! يرجى الاحتفاظ بها تحت 500 حرف."
          : "Message too long! Please keep it under 500 characters.",
      );
      return;
    }

    const userMessage = { text: trimmedInput, isUser: true, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const botReply = responses[trimmedInput] || responses.default;
      setIsThinking(false);
      setMessages((prev) => [...prev, { text: botReply, isUser: false, timestamp: new Date() }]);
    }, 1000);
  };

  const handleSelectQuestion = (question) => {
    if (messages.length >= 10) {
      toast.warning(
        language === "ar"
          ? "تم الوصول إلى حد الدردشة! يرجى بدء جلسة جديدة."
          : "Chat limit reached! Please start a new session.",
      );
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
    <div
      className="fixed bottom-4 right-4 z-50"
      role="region"
      aria-label={language === "ar" ? "أداة الدردشة المباشرة" : "Live Chat Widget"}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
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
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 id="live-chat-title" className="text-lg font-semibold">
              {title}
            </h3>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                aria-label={language === "ar" ? "إغلاق الدردشة" : "Close chat"}
              >
                <X size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label={language === "ar" ? "تصغير الدردشة" : "Minimize chat"}
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
                <span className="ml-2">
                  {language === "ar" ? "جاري التفكير..." : "Thinking..."}
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              {questions.map((question, index) => (
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
                placeholder={placeholder}
                aria-label="Chat input"
                maxLength={500}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              <Button
                onClick={handleSend}
                className="bg-primary text-white hover:bg-primary/90"
                aria-label={language === "ar" ? "إرسال الرسالة" : "Send message"}
                disabled={
                  isThinking ||
                  (!input.trim() && !questions.includes(input)) ||
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
