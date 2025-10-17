"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "@/components/admin/UsersTable";
import BooksTable from "@/components/admin/BooksTable";
import OrdersTable from "@/components/admin/OrdersTable";
import translations from "@/lib/translations";

export default function AdminDashboard() {
  const { user, language, isAdmin } = useStore();
  const router = useRouter();
  const t = translations[language];

  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to /");
      router.push("/");
    } else if (!isAdmin()) {
      console.log("User is not admin, redirecting to /");
      router.push("/");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin()) {
    return <div>Loading or unauthorized...</div>;
  }

  return (
    <div className="container mx-auto py-12" dir={language === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold mb-8">{t.adminDashboard || "Admin Dashboard"}</h1>
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="books">{t.books || "Books"}</TabsTrigger>
          <TabsTrigger value="users">{t.users || "Users"}</TabsTrigger>
          <TabsTrigger value="orders">{t.orders || "Orders"}</TabsTrigger>
        </TabsList>
        <TabsContent value="books">
          <BooksTable />
        </TabsContent>
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
