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
      if (error || !data.user || data.user.user_metadata.role !== "admin") {
        router.push("/admin/login");
      } else {
        console.log("Admin UUID:", data.user.id);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "admin-access-token=; Max-Age=0; path=/;";
    router.push("/admin/login");
  };

  return (
    <div className="container mx-auto py-12" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t.adminDashboard || "Admin Dashboard"}</h1>
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
          <TabsTrigger value="users">{t.users || "Users"}</TabsTrigger>
          <TabsTrigger value="orders">{t.orders || "Orders"}</TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BooksTable />
        </TabsContent>

        <TabsContent value="users">{/* UsersTable later */}</TabsContent>

        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
