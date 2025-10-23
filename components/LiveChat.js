import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, X, Minus } from "lucide-react";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  const questions = [
    "كيف يمكنني تتبع طلبيتي؟",
    "ما هي سياسة الإرجاع؟",
    "هل تقدمون شحنًا دوليًا؟",
    "كيف يمكنني التواصل مع الدعم الفني؟",
  ];

  const responses = {
    "كيف يمكنني تتبع طلبيتي؟":
      "يمكنك تتبع طلبيتك من خلال تسجيل الدخول إلى حسابك وزيارة قسم 'سجل الطلبات'.",
    "ما هي سياسة الإرجاع؟":
      "نقدم سياسة إرجاع لمدة 30 يومًا. يجب أن تكون المنتجات غير مستخدمة وفي عبوتها الأصلية.",
    "هل تقدمون شحنًا دوليًا؟": "نعم، نقدم الشحن الدولي. تختلف التكاليف والأوقات حسب المنطقة.",
    "كيف يمكنني التواصل مع الدعم الفني؟":
      "يمكنك التواصل معنا عبر البريد الإلكتروني support@thamaratalawrak.com أو الاتصال على +123-456-7890.",
    default: "عذرًا، يمكنني الإجابة فقط على الأسئلة المحددة مسبقًا. يرجى اختيار واحدة من الاقتراحات!",
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

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
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" dir="rtl">
      <Button
        className="bg-burgundy text-white hover:bg-burgundy-dark rounded-full w-14 h-14 flex items-center justify-center transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare />
      </Button>

      {isOpen && (
        <div className="w-80 h-96 bg-white p-4 rounded-lg shadow-lg mt-2 border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">الدردشة المباشرة</h3>
            <div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="ml-2">
                <Minus size={16} />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.isUser ? "bg-burgundy text-white self-end" : "bg-gray-200 text-gray-900"
                } max-w-[70%]`}
              >
                <span>{msg.text}</span>
                <span className="text-xs opacity-70 ml-2">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            {isThinking && (
              <div className="p-2 text-gray-900 flex items-center">
                <span className="dot-flashing"></span>
                <span className="dot-flashing" style={{ animationDelay: "0.2s" }}></span>
                <span className="dot-flashing" style={{ animationDelay: "0.4s" }}></span>
                <span className="ml-2">جاري التفكير...</span>
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
                  className="text-gray-900 hover:bg-gray-200 text-xs"
                  disabled={isThinking}
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
                className="flex-1"
                placeholder="اكتب رسالتك..."
                maxLength={500}
              />
              <Button
                onClick={handleSend}
                className="bg-burgundy text-white hover:bg-burgundy-dark"
                disabled={isThinking || !input.trim()}
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
