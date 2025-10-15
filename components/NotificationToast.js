"use client";

import { toast } from "sonner";
import { useEffect } from "react";

export default function NotificationToast({ message, open }) {
  useEffect(() => {
    if (open && message) {
      toast({
        title: "Notification",
        description: message,
        duration: 5000,
      });
    }
  }, [open, message]);

  return null;
}
