"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DataTable = ({ columns, data, onEdit, onDelete, onUpdateStatus, t = {} }) => {
  const [editingRow, setEditingRow] = useState(null);

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
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.accessorKey} className="border border-gray-300 p-2">
                  {col.accessorKey === "actions" ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => onEdit(row)}>
                        {t.edit || "Edit"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(row.id)}>
                        {t.delete || "Delete"}
                      </Button>
                      {onUpdateStatus && col.accessorKey === "status" && (
                        <Select onValueChange={(value) => onUpdateStatus(row.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue>{row.status}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ) : (
                    row[col.accessorKey]
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
