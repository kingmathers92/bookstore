"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";

export default function OrdersTable({ onArchive }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const archiveOrder = async (order) => {
    if (!confirm("Move to archive?")) return;
    try {
      const res = await fetch("/api/admin/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: { ...order, original_order_id: order.id } }),
      });
      if (!res.ok) throw new Error("Archive failed");
      fetchOrders();
      onArchive?.();
    } catch (err) {
      alert("Archive failed");
    }
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Active Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active orders</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={order.status === "delivered"}
                      onCheckedChange={(checked) =>
                        updateStatus(order.id, checked ? "delivered" : "pending")
                      }
                    />
                    <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => archiveOrder(order)}
                    title="Archive"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">{order.full_name}</p>
                    <p className="text-gray-600">{order.phone}</p>
                    <p className="text-gray-600">{order.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{order.total_amount} د.ت</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="font-medium mb-2">Items:</p>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => {
                      const displayTitle =
                        item.title_ar || item.title_en || `Book #${item.book_id}`;
                      return (
                        <li key={i} className="flex justify-between text-xs">
                          <span>
                            {displayTitle} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} د.ت
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
