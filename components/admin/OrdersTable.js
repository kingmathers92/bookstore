"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { toast } from "@/components/ui/sonner";
import translations from "@/lib/translations";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Customer Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "total_price", header: "Total Price" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "order_date", header: "Order Date" },
];

export default function OrdersTable() {
  const { language } = useStore();
  const t = translations[language];

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) throw error;
      toast.success(t.orderUpdated || "Order status updated!");
    } catch (error) {
      toast.error(t.errorUpdatingOrder || `Error updating order: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t.manageOrders || "Manage Orders"}</h2>
      <DataTable columns={columns} data={orders} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
