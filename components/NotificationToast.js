"use client";

import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";

export default function NotificationToast({ message, open }) {
  const { toast } = Toaster();

  useEffect(() => {
    if (open && message) {
      toast({
        title: "Notification",
        description: message,
        duration: 5000,
      });
    }
  }, [open, message, toast]);

  return null;
}
