"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const DataTable = ({ columns, data, onEdit, onDelete, onBulkDelete }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwjgycjwzuflbeclgsc.supabase.co";

  const handleSelect = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected for deletion");
      return;
    }
    if (!confirm("Are you sure you want to delete the selected items?")) return;

    try {
      await Promise.all(
        selectedItems.map((id) => fetch(`/api/admin/books?id=${id}`, { method: "DELETE" })),
      );
      if (onBulkDelete) onBulkDelete(selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Error deleting selected items");
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <Button onClick={handleBulkDelete} variant="destructive">
          Delete Selected
        </Button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">
              <Checkbox
                checked={selectedItems.length === data.length && data.length > 0}
                onCheckedChange={(checked) =>
                  setSelectedItems(checked ? data.map((row) => row.book_id || row.id) : [])
                }
              />
            </th>
            {columns.map((col) => (
              <th key={col.accessorKey} className="border border-gray-300 p-2 text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.book_id || row.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">
                <Checkbox
                  checked={selectedItems.includes(row.book_id || row.id)}
                  onCheckedChange={() => handleSelect(row.book_id || row.id)}
                />
              </td>

              {columns.map((col) => (
                <td key={col.accessorKey} className="border border-gray-300 p-2">
                  {col.accessorKey === "actions" ? (
                    <div className="flex gap-2">
                      <Button onClick={() => onEdit(row)}>Edit</Button>
                      <Button onClick={() => onDelete(row.book_id || row.id)} variant="destructive">
                        Delete
                      </Button>
                    </div>
                  ) : col.accessorKey === "image" ? (
                    row.image ? (
                      <img
                        src={
                          row.image.startsWith("http")
                            ? row.image
                            : `${supabaseUrl}/storage/v1/object/public/${row.image}`
                        }
                        alt={row.title_en || row.title_ar || "Book Image"}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    )
                  ) : col.accessorKey === "index" ? (
                    row.index
                  ) : (
                    row[col.accessorKey] || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
