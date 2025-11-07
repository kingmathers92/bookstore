"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { DataTable } from "@/components/admin/DataTable";
import translations from "@/lib/translations";
import { showError, showSuccess } from "@/components/Toast";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "full_name", header: "Customer Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "total_amount", header: "Total Price" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "created_at", header: "Order Date" },
];

export default function OrdersTable() {
  const { language } = useStore();
  const t = translations[language];
  const [orders, setOrders] = useState([]);

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error.message);
        showError("Error loading orders");
      } else {
        setOrders(data);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
      showSuccess(t.orderUpdated || "Order status updated!");
    } catch (error) {
      showError(t.errorUpdatingOrder || `Error updating order: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t.manageOrders || "Manage Orders"}</h2>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
