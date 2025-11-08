"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/orders");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch");
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Orders fetch error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <p>
                  <strong>Full Name:</strong> {order.full_name || "—"}
                </p>
                <p>
                  <strong>Phone:</strong> {order.phone || "—"}
                </p>
                <p>
                  <strong>Address:</strong> {order.address || "—"}
                </p>
                <p>
                  <strong>Total:</strong> {order.total_amount} د.ت
                </p>
                <p>
                  <strong>Status:</strong> <span className="capitalize">{order.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <div className="mt-3">
                  <strong>Items:</strong>
                  <ul className="list-disc ml-5 text-sm">
                    {(order.items || []).map((item, i) => (
                      <li key={i}>
                        Book ID: {item.book_id} × {item.quantity} ({item.price} د.ت)
                      </li>
                    ))}
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
