"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function BookOfTheDay() {
  useEffect(() => {
    const book = {
      title: "كتاب اليوم: تفسير الجلالين",
      price: 75,
      image: "/images/book1.jpg",
    };
    console.log(`كتاب اليوم: ${book.title} - ${book.price} ر.س`); // use api later
  }, []);

  return (
    <div className="container mx-auto py-8 text-center">
      <h3 className="text-2xl font-bold text-green-900 mb-4">كتاب اليوم</h3>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <img
            src="/images/book1.webp"
            alt="كتاب اليوم"
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Clock size={16} /> <CardTitle>تحقق لاحقًا لمعرفة العرض!</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
