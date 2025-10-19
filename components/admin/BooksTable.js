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
      const { error } = await supabase.from("books").delete().eq("book_id", bookId);
      if (error) throw error;
      showSuccess(t.bookDeleted || "Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      showError(t.errorDeletingBook || `Error deleting book: ${error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      const supabaseWithSession = await getSupabaseWithSession();
      let updateData = { ...formData };
      delete updateData.book_id;
      delete updateData.actions;

      if (updateData.image instanceof File) {
        const fileName = `books/${Date.now()}_${updateData.image.name}`;
        const { data: uploadData, error: uploadError } = await supabaseWithSession.storage
          .from("book-images")
          .upload(fileName, updateData.image, { upsert: true });

        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

        const { data: urlData } = await supabaseWithSession.storage
          .from("book-images")
          .getPublicUrl(fileName);
        if (!urlData?.publicUrl) {
          throw new Error("Failed to retrieve public URL");
        }
        updateData.image = urlData.publicUrl;
      } else if (!updateData.image && isEditing !== "new") {
        const existingBook = books.find((b) => b.book_id === isEditing);
        updateData.image = existingBook?.image || null;
      }

      let result;
      if (isEditing === "new") {
        const { data, error } = await supabase.from("books").insert([updateData]);
        if (error) throw error;
        result = data;
        showSuccess(t.bookCreated || "Book created successfully!");
      } else {
        const { data, error } = await supabase
          .from("books")
          .update(updateData)
          .eq("book_id", isEditing);
        if (error) throw error;
        result = data;
        showSuccess(t.bookUpdated || "Book updated successfully!");
      }

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

    const fileName = `books/${Date.now()}_${file.name}`;
    try {
      const supabaseWithSession = await getSupabaseWithSession();
      console.log("Session for upload:", await supabase.auth.getSession()); // Debug session
      const { data, error } = await supabaseWithSession.storage
        .from("book-images")
        .upload(fileName, file, { upsert: true });

      if (error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }

      const { data: urlData, error: urlError } = await supabaseWithSession.storage
        .from("book-images")
        .getPublicUrl(fileName);

      if (urlError) {
        throw new Error(`Failed to get image URL: ${urlError.message}`);
      }

      if (!urlData?.publicUrl) {
        throw new Error("Public URL is undefined");
      }

      setFormData((prev) => ({ ...prev, image: urlData.publicUrl }));
      showSuccess(t.imageUploaded || "Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      showError(`Image upload failed: ${error.message}`);
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
              <Input type="file" onChange={handleImageUpload} />
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
