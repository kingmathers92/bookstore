"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ArchiveTable() {
  const [archived, setArchived] = useState([]);

  useEffect(() => {
    fetch("/api/admin/archive")
      .then((r) => r.json())
      .then(setArchived)
      .catch(() => setArchived([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Archived Orders</h1>
      {archived.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No archived orders</p>
      ) : (
        <div className="grid gap-4">
          {archived.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 text-sm">
                <p>
                  <strong>{order.full_name}</strong> • {order.total_amount} د.ت
                </p>
                <p className="text-gray-600">{new Date(order.archived_at).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">{order.items.length} items • Delivered</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
