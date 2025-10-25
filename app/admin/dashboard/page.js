"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
//import UsersTable from "@/components/admin/UsersTable";
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
      const { data } = await supabase.auth.getUser();
      if (!data.user || data.user.user_metadata.role !== "admin") {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="container mx-auto py-12" dir={language === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold mb-8">{t.adminDashboard || "Admin Dashboard"}</h1>
      <Button
        variant="outline"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/admin/login");
        }}
      >
        Logout
      </Button>

      <Tabs defaultValue="books" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="books">{t.books || "Books"}</TabsTrigger>
          <TabsTrigger value="users">{t.users || "Users"}</TabsTrigger>
          <TabsTrigger value="orders">{t.orders || "Orders"}</TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BooksTable />
        </TabsContent>

        <TabsContent value="users"></TabsContent>

        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
