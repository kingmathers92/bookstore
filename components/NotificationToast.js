"use client";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function NotificationToast({ message, open }) {
  const { toast } = useToast();

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
