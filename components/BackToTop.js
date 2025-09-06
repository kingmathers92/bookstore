"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 hover:cursor-pointer">
      {isVisible && (
        <Button
          className="bg-emerald-700 text-cream-100 hover:bg-green-900 rounded-full w-14 h-14 flex items-center justify-center"
          onClick={scrollToTop}
          aria-label="العودة إلى الأعلى"
        >
          <ArrowUp size={24} />
        </Button>
      )}
    </div>
  );
}
