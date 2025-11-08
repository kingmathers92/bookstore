"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BooksTable from "@/components/admin/BooksTable";
import OrdersTable from "@/components/admin/OrdersTable";
import translations from "@/lib/translations";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const { language } = useStore();
  const router = useRouter();
  const t = translations[language];

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">{t.adminDashboard || "Admin Dashboard"}</h1>
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white mt-12"
        >
          {t.logout || "Logout"}
        </Button>
      </div>

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="books">{t.books || "Books"}</TabsTrigger>
          <TabsTrigger value="orders">{t.orders || "Orders"}</TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BooksTable />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
