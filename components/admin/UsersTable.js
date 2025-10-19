"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/DataTable";
import translations from "@/lib/translations";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "actions", header: "Actions" },
];

export default function UsersTable() {
  const { language } = useStore();
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (row) => {
    setIsEditing(row.id);
    setFormData(row);
  };

  const handleSave = async (userId) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, formData);
      if (error) throw error;
      alert.success(t.userUpdated || "User updated successfully!");
      setIsEditing(null);
    } catch (error) {
      alert.error(t.errorUpdatingUser || `Error updating user: ${error.message}`);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm(t.confirmDelete || "Are you sure you want to delete this user?")) return;
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      alert.success(t.userDeleted || "User deleted successfully!");
    } catch (error) {
      alert.error(t.errorDeletingUser || `Error deleting user: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t.manageUsers || "Manage Users"}</h2>
      <DataTable columns={columns} data={users} />
      {isEditing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Input
                placeholder={t.email || "Email"}
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.role || "Role"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleSave(isEditing)}>{t.updateUser || "Update User"}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
