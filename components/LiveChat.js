"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleChat = () => {
    setIsOpen(true);
    alert(
      "Live chat feature coming soon! Contact us at support@thamaratalawrak.com for now."
    ); // replacing with chat service or AI later
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="bg-emerald-700 text-cream-100 hover:bg-green-900 rounded-full w-14 h-14 flex items-center justify-center"
        onClick={handleChat}
        aria-label="فتح الدردشة المباشرة"
      >
        <MessageSquare />
      </Button>
      {isOpen && (
        <div className="bg-cream-100 p-2 rounded mt-2">
          Chat will open here soon!
        </div>
      )}
    </div>
  );
}
