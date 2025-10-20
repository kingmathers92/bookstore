"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const DataTable = ({ columns, data, onEdit, onDelete }) => {
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
      setSelectedBooks([]);
      data.filter((book) => !selectedBooks.includes(book.book_id));
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Error deleting selected books");
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
                checked={selectedBooks.length === data.length}
                onCheckedChange={(checked) =>
                  setSelectedBooks(checked ? data.map((book) => book.book_id) : [])
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
            <tr key={row.book_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">
                <Checkbox
                  checked={selectedBooks.includes(row.book_id)}
                  onCheckedChange={() => handleSelect(row.book_id)}
                />
              </td>
              {columns.map((col) => (
                <td key={col.accessorKey} className="border border-gray-300 p-2">
                  {col.accessorKey === "actions" ? (
                    <div className="flex gap-2">
                      <Button onClick={() => onEdit(row)}>Edit</Button>
                      <Button onClick={() => onDelete(row.book_id)} variant="destructive">
                        Delete
                      </Button>
                    </div>
                  ) : col.accessorKey === "image" ? (
                    row.image ? (
                      <img src={row.image} alt="Book Image" className="w-16 h-16 object-cover" />
                    ) : (
                      <span>No Image</span>
                    )
                  ) : (
                    (row[col.accessorKey] ?? "N/A")
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
