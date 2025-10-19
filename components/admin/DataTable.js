"use client";

import { Button } from "@/components/ui/button";

export const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
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
