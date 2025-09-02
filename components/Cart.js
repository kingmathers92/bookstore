"use client";

import { useStore } from "@/lib/store";

export default function Cart() {
  const { cart, removeFromCart } = useStore();

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-green-900 mb-4">السلة</h2>
      {cart.length === 0 ? (
        <p>السلة فارغة</p>
      ) : (
        <div className="grid gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <span>
                {item.title} - {item.price} ر.س
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
