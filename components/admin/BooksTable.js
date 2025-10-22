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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleNewBook = () => {
    setIsEditing("new");
    setFormData({});
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId) => {
    if (!confirm(t.confirmDelete || "Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/admin/books?id=${bookId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      showSuccess(t.bookDeleted || "Book deleted successfully!");
      setBooks((prevBooks) => prevBooks.filter((book) => book.book_id !== bookId));
    } catch (error) {
      showError(t.errorDeletingBook || `Error deleting book: ${error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      let payload = { ...formData };
      delete payload.actions;
      delete payload.index;
      payload.priceBeforeDiscount = formData.priceBeforeDiscount || null;

      const categoryMapping = {
        "quran-copies": { en: "Quran", ar: "قرآن" },
        tafsir: { en: "Tafsir", ar: "تفسير" },
        fiqh: { en: "Fiqh", ar: "الفقه" },
        language: { en: "Language", ar: "لغة" },
        hadith: { en: "Hadith", ar: "حديث" },
        seerah: { en: "Seerah", ar: "سيرة" },
        admonitions: { en: "Admonitions", ar: "موعظة" },
        spirituality: { en: "Spirituality", ar: "روحانية" },
        poetry: { en: "Poetry", ar: "الشعر" },
        "children-books": { en: "Children’s Books", ar: "كتب الأطفال" },
        supplications: { en: "Supplications & Invocations", ar: "أدعية وأذكار" },
        "quranic-sciences": { en: "Quranic Sciences", ar: "علوم القرآن" },
        creed: { en: "Creed", ar: "عقيدة" },
      };

      if (payload.category) {
        const categoryData = categoryMapping[payload.category] || {
          en: payload.category.replace(/-/g, " "),
          ar: payload.category.replace(/-/g, " "),
        };
        payload.category_en = categoryData.en;
        payload.category_ar = categoryData.ar;
        delete payload.category;
      } else {
        payload.category_en = payload.category_en || "";
        payload.category_ar = payload.category_ar || "";
      }

      const method = isEditing === "new" ? "POST" : "PUT";
      if (isEditing !== "new") payload.book_id = isEditing;

      console.log("Payload before save:", payload);

      let newBookId = null;
      let data = null;
      if (method === "POST") {
        const res = await fetch("/api/admin/books", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data?.error || `API request failed with status ${res.status}`);
        newBookId = data[0]?.book_id;
        if (!newBookId) throw new Error("Failed to retrieve new book ID");
        setIsEditing(newBookId);
        payload.book_id = newBookId;
      }

      if (document.querySelector("input[type='file']").files[0]) {
        const formData = new FormData();
        formData.append("file", document.querySelector("input[type='file']").files[0]);
        formData.append(
          "filename",
          `books/${Date.now()}_${document.querySelector("input[type='file']").files[0].name}`,
        );

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
        payload.image = uploadData.publicUrl;
        console.log("Image uploaded:", uploadData);

        const bookIdToUpdate = newBookId || isEditing;
        if (bookIdToUpdate) {
          const updateRes = await fetch("/api/admin/books", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              book_id: bookIdToUpdate,
              image: uploadData.publicUrl,
            }),
          });
          if (!updateRes.ok) {
            const errorData = await updateRes.json();
            throw new Error(errorData.error || `Update failed with status ${updateRes.status}`);
          }
          const updateData = await updateRes.json();
          console.log("Book updated with image:", updateData);
        }
      }

      if (method === "PUT") {
        const res = await fetch("/api/admin/books", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || `API request failed with status ${res.status}`);
        }
      }

      if (isEditing === "new") showSuccess(t.bookCreated || "Book created successfully!");
      else showSuccess(t.bookUpdated || "Book updated successfully!");

      setIsEditing(null);
      setFormData({});
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      console.error("handleSave error:", err);
      showError(err.message || t.errorUpdatingBook || "Error updating book");
      if (err.message.includes("404")) {
        showError("API endpoint not found. Please check the server configuration.");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bookId = isEditing;
    if (!bookId || typeof bookId !== "string" || bookId === "new") {
      showError("Please save the book first before uploading an image");
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

      console.log("Image uploaded:", data);

      const updateRes = await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          image: data.publicUrl,
        }),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.error || `Update failed with status ${updateRes.status}`);
      }

      const updateData = await updateRes.json();
      console.log("Book updated successfully:", updateData);
      showSuccess("Image updated successfully!");
      setFormData((prev) => ({ ...prev, image: data.publicUrl }));
      fetchBooks();
    } catch (err) {
      console.error("Image upload error:", err);
      showError(`Image upload failed: ${err.message}`);
    }
  };

  const handleCloseModal = () => {
    setIsEditing(null);
    setFormData({});
    setIsModalOpen(false);
  };

  const booksWithActions = books.map((book, index) => ({
    ...book,
    index: index + 1,
    actions: [
      { label: "Edit", onClick: () => handleEdit(book) },
      { label: "Delete", onClick: () => handleDelete(book.book_id) },
    ],
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.manageBooks || "Manage Books"}</h2>
        <Button className="hover:cursor-pointer" onClick={handleNewBook}>
          {t.addBook || "Add Book"}
        </Button>
      </div>

      <DataTable
        columns={[
          { accessorKey: "index", header: "#" },
          { accessorKey: "title_en", header: "English Title" },
          { accessorKey: "title_ar", header: "Arabic Title" },
          { accessorKey: "author_en", header: "Author EN" },
          { accessorKey: "author_ar", header: "Author AR" },
          { accessorKey: "publishing_house_en", header: "Publisher EN" },
          { accessorKey: "publishing_house_ar", header: "Publisher AR" },
          { accessorKey: "category_en", header: "Category EN" },
          { accessorKey: "category_ar", header: "Category AR" },
          { accessorKey: "price", header: "Price" },
          { accessorKey: "inStock", header: "In Stock" },
          { accessorKey: "image", header: "Image" },
          { accessorKey: "actions", header: "Actions" },
        ]}
        data={booksWithActions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={(deletedIds) =>
          setBooks((prev) => prev.filter((book) => !deletedIds.includes(book.book_id)))
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg shadow-lg">
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button variant="ghost" onClick={handleCloseModal} className="hover:cursor-pointer">
                  X
                </Button>
              </div>
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
                  <SelectItem value="quran-copies">Quran</SelectItem>
                  <SelectItem value="tafsir">Tafsir</SelectItem>
                  <SelectItem value="fiqh">Fiqh</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="hadith">Hadith</SelectItem>
                  <SelectItem value="seerah">Seerah</SelectItem>
                  <SelectItem value="admonitions">Admonitions</SelectItem>
                  <SelectItem value="spirituality">Spirituality</SelectItem>
                  <SelectItem value="poetry">Poetry</SelectItem>
                  <SelectItem value="children-books">Children’s Books</SelectItem>
                  <SelectItem value="supplications">Supplications & Invocations</SelectItem>
                  <SelectItem value="quranic-sciences">Quranic Sciences</SelectItem>
                  <SelectItem value="quranic-sciences">Creed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={t.descriptionEn || "Description EN"}
                value={formData.description_en || ""}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              />
              <Input
                placeholder={t.descriptionAr || "Description AR"}
                value={formData.description_ar || ""}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              />
              <Input
                type="number"
                value={formData.priceBeforeDiscount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, priceBeforeDiscount: parseFloat(e.target.value) || 0 })
                }
                placeholder={t.priceBeforeDiscount || "Price Before Discount"}
              />
              <Input
                type="number"
                placeholder={t.price || "Price"}
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
              />
              <div>
                <Input type="file" onChange={(e) => handleImageUpload(e)} />
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
              <Button onClick={handleSave} className="w-full hover:cursor-pointer">
                {isEditing === "new" ? t.addBook || "Add Book" : t.updateBook || "Update Book"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
