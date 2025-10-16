"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/admin/DataTable";
import { toast } from "@/components/ui/sonner";
import translations from "@/lib/translations";

const columns = [
  { accessorKey: "book_id", header: "ID" },
  { accessorKey: "title_en", header: "English Title" },
  { accessorKey: "title_ar", header: "Arabic Title" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "inStock", header: "In Stock" },
  { accessorKey: "actions", header: "Actions" },
];

export default function BooksTable() {
  const { language } = useStore();
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (row) => {
    setIsEditing(row.book_id);
    setFormData(row);
  };

  const handleSave = async (bookId) => {
    try {
      const { error } = await supabase.from("books").update(formData).eq("book_id", bookId);
      if (error) throw error;
      toast.success(t.booksUpdated || "Book updated successfully!");
      setIsEditing(null);
    } catch (error) {
      toast.error(t.errorUpdatingBook || `Error updating book: ${error.message}`);
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm(t.confirmDelete || "Are you sure you want to delete this book?")) return;
    try {
      const { error } = await supabase.from("books").delete().eq("book_id", bookId);
      if (error) throw error;
      toast.success(t.bookDeleted || "Book deleted successfully!");
    } catch (error) {
      toast.error(t.errorDeletingBook || `Error deleting book: ${error.message}`);
    }
  };

  const handleCreate = async () => {
    try {
      const { error } = await supabase.from("books").insert([formData]);
      if (error) throw error;
      toast.success(t.bookCreated || "Book created successfully!");
      setFormData({});
    } catch (error) {
      toast.error(t.errorCreatingBook || `Error creating book: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.manageBooks || "Manage Books"}</h2>
        <Button onClick={() => setIsEditing("new")}>{t.addBook || "Add Book"}</Button>
      </div>
      <DataTable columns={columns} data={books} onEdit={handleEdit} onDelete={handleDelete} />
      {isEditing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Input
                placeholder={t.titleEn || "English Title"}
                value={formData.title_en || ""}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              />
              <Input
                placeholder={t.titleAr || "Arabic Title"}
                value={formData.title_ar || ""}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
              />
              <Select onValueChange={(value) => setFormData({ ...formData, category_en: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.category || "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tafsir">Tafsir</SelectItem>
                  <SelectItem value="hadith">Hadith</SelectItem>
                  <SelectItem value="fiqh">Fiqh</SelectItem>
                  <SelectItem value="biography">Biography</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder={t.price || "Price"}
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // upload to Supabase storage
                    supabase.storage.from("book-images").upload(`books/${Date.now()}.jpg`, file);
                  }
                }}
              />
              <Checkbox
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              >
                <Label htmlFor="inStock">{t.inStock || "In Stock"}</Label>
              </Checkbox>
              <Button
                onClick={() => (isEditing === "new" ? handleCreate() : handleSave(isEditing))}
              >
                {isEditing === "new" ? t.addBook : t.updateBook || "Update Book"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
