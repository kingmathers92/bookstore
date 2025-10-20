"use client";

import { useState, useEffect } from "react";
import { supabase, getSupabaseWithSession } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/admin/DataTable";
import { showSuccess, showError } from "@/components/Toast";
import translations from "@/lib/translations";

export default function BooksTable() {
  const { language, user } = useStore();
  const t = translations[language];

  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) {
      console.error("Fetch error:", error);
    } else {
      setBooks(data || []);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEdit = (book) => {
    setIsEditing(book.book_id);
    setFormData({ ...book });
  };

  const handleDelete = async (bookId) => {
    if (!confirm(t.confirmDelete || "Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/admin/books?id=${bookId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      showSuccess(t.bookDeleted || "Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      showError(t.errorDeletingBook || `Error deleting book: ${error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      delete payload.actions;

      const method = isEditing === "new" ? "POST" : "PUT";
      if (isEditing !== "new") payload.book_id = isEditing;

      const res = await fetch("/api/admin/books", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");

      if (isEditing === "new") showSuccess(t.bookCreated || "Book created successfully!");
      else showSuccess(t.bookUpdated || "Book updated successfully!");

      setIsEditing(null);
      setFormData({});
      fetchBooks();
    } catch (err) {
      console.error("handleSave error:", err);
      showError(err.message || t.errorUpdatingBook || "Error updating book");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bookId = isEditing || (books.length > 0 ? books[0].book_id : null);
    if (!bookId) {
      showError("No book selected for image upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", `books/${Date.now()}_${file.name}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      console.log("Image uploaded:", data.publicUrl);

      const updateRes = await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          image: data.publicUrl,
        }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.error || "Book update failed");

      console.log("Book updated successfully:", updateData.data);
      showSuccess("Image updated successfully!");
      setFormData((prev) => ({ ...prev, image: data.publicUrl }));
      fetchBooks();
    } catch (err) {
      console.error("Image upload error:", err);
      showError(`Image upload failed: ${err.message}`);
    }
  };

  const booksWithActions = books.map((book) => ({
    ...book,
    actions: [
      { label: "Edit", onClick: () => handleEdit(book) },
      { label: "Delete", onClick: () => handleDelete(book.book_id) },
    ],
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.manageBooks || "Manage Books"}</h2>
        <Button onClick={() => setIsEditing("new")}>{t.addBook || "Add Book"}</Button>
      </div>

      <DataTable
        columns={[
          { accessorKey: "book_id", header: "ID" },
          { accessorKey: "title_en", header: "English Title" },
          { accessorKey: "title_ar", header: "Arabic Title" },
          { accessorKey: "author_en", header: "Author EN" },
          { accessorKey: "author_ar", header: "Author AR" },
          { accessorKey: "publishing_house_en", header: "Publisher EN" },
          { accessorKey: "publishing_house_ar", header: "Publisher AR" },
          { accessorKey: "category", header: "Category" },
          { accessorKey: "price", header: "Price" },
          { accessorKey: "inStock", header: "In Stock" },
          { accessorKey: "image", header: "Image" },
          { accessorKey: "actions", header: "Actions" },
        ]}
        data={booksWithActions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isEditing && (
        <Card>
          <CardContent className="p-6 space-y-4">
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
            <Input
              placeholder={t.authorEn || "Author EN"}
              value={formData.author_en || ""}
              onChange={(e) => setFormData({ ...formData, author_en: e.target.value })}
            />
            <Input
              placeholder={t.authorAr || "Author AR"}
              value={formData.author_ar || ""}
              onChange={(e) => setFormData({ ...formData, author_ar: e.target.value })}
            />
            <Input
              placeholder={t.publisherEn || "Publisher EN"}
              value={formData.publishing_house_en || ""}
              onChange={(e) => setFormData({ ...formData, publishing_house_en: e.target.value })}
            />
            <Input
              placeholder={t.publisherAr || "Publisher AR"}
              value={formData.publishing_house_ar || ""}
              onChange={(e) => setFormData({ ...formData, publishing_house_ar: e.target.value })}
            />
            <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
            <div>
              <Input
                type="file"
                onChange={(e) =>
                  handleImageUpload(e, isEditing || (books.length > 0 ? books[0].book_id : null))
                }
              />
              {formData.image && (
                <img src={formData.image} alt="Book Image" className="w-32 mt-2" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={formData.inStock || false}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              />
              <Label htmlFor="inStock">{t.inStock || "In Stock"}</Label>
            </div>
            <Button onClick={handleSave}>
              {isEditing === "new" ? t.addBook || "Add Book" : t.updateBook || "Update Book"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
