"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const DataTable = ({ columns, data, onEdit, onDelete, onBulkDelete }) => {
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleSelect = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId],
    );
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) {
      alert("No books selected for deletion");
      return;
    }
    if (!confirm("Are you sure you want to delete the selected books?")) return;
    try {
      await Promise.all(
        selectedBooks.map((bookId) => fetch(`/api/admin/books?id=${bookId}`, { method: "DELETE" })),
      );
      if (onBulkDelete) onBulkDelete(selectedBooks);
      setSelectedBooks([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Error deleting selected books");
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <Button onClick={handleBulkDelete} variant="destructive" className="hover:cursor-pointer">
          Delete Selected
        </Button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">
              <Checkbox
                checked={selectedBooks.length === data.length}
                onCheckedChange={(checked) =>
                  setSelectedBooks(checked ? data.map((book) => book.book_id) : [])
                }
                className="hover:cursor-pointer"
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
            <tr key={row.book_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">
                <Checkbox
                  checked={selectedBooks.includes(row.book_id)}
                  onCheckedChange={() => handleSelect(row.book_id)}
                  className="hover:cursor-pointer"
                />
              </td>
              {columns.map((col) => (
                <td key={col.accessorKey} className="border border-gray-300 p-2">
                  {col.accessorKey === "actions" ? (
                    <div className="flex gap-2">
                      <Button onClick={() => onEdit(row)} className="hover:cursor-pointer">
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDelete(row.book_id)}
                        variant="destructive"
                        className="hover:cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  ) : col.accessorKey === "image" ? (
                    row.image ? (
                      <img src={row.image} alt="Book Image" className="w-16 h-16 object-cover" />
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
