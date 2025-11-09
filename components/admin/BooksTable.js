"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
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
import { Loader2 } from "lucide-react";
import translations from "@/lib/translations";

export default function BooksTable() {
  const { language } = useStore();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) {
      console.error("Fetch error:", error);
      showError(t.errorFetchingBooks || "Error fetching books");
    } else {
      setBooks(data || []);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const categoryMapping = {
    quran: { en: "Quran", ar: "قرآن" },
    hadith: { en: "Hadith", ar: "حديث" },
    fiqh: { en: "Fiqh", ar: "فقه" },
    aqidah: { en: "Aqidah", ar: "عقيدة" },
    language: { en: "Language", ar: "لغة" },
    history: { en: "History", ar: "تاريخ" },
    culture: { en: "Culture", ar: "ثقافة" },
    children: { en: "Children", ar: "طفل" },
    seerah: { en: "Seerah", ar: "سيرة" },
  };

  const handleEdit = (book) => {
    const editBook = { ...book };
    const foundKey = Object.keys(categoryMapping).find(
      (key) => categoryMapping[key].en === book.category_en,
    );
    editBook.category = foundKey || "quran";

    setIsEditing(book.book_id);
    setFormData(editBook);
    setPendingImageFile(null);
    setIsModalOpen(true);
  };

  const handleNewBook = () => {
    setIsEditing("new");
    setFormData({});
    setPendingImageFile(null);
    setIsModalOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let payload = { ...formData };
      delete payload.actions;
      delete payload.index;

      if (payload.category) {
        const cat = categoryMapping[payload.category] || {
          en: payload.category,
          ar: payload.category,
        };
        payload.category_en = cat.en;
        payload.category_ar = cat.ar;
        delete payload.category;
      } else {
        payload.category_en = "";
        payload.category_ar = "";
      }

      const isCreating = isEditing === "new";
      let bookId = isEditing;

      if (isCreating && payload.book_id) delete payload.book_id;
      if (!isCreating) payload.book_id = isEditing;

      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/books", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }

      const data = await res.json();
      bookId = data[0]?.book_id || bookId;

      if (pendingImageFile) {
        const fd = new FormData();
        fd.append("file", pendingImageFile);
        const sanitizedName = pendingImageFile.name.replace(/[^\w.-]/g, "_").toLowerCase();
        fd.append("filename", `books/${Date.now()}_${sanitizedName}`);

        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const uploadBody = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadBody.error || "Image upload failed");

        const imageUrl = uploadBody.publicUrl;
        await supabase.from("books").update({ image: imageUrl }).eq("book_id", bookId);
      }

      showSuccess(isCreating ? t.bookCreated : t.bookUpdated);
      setIsModalOpen(false);
      setIsEditing(null);
      setFormData({});
      setPendingImageFile(null);
      fetchBooks();
    } catch (err) {
      showError(err.message || "Error saving book");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsEditing(null);
    setFormData({});
    setIsModalOpen(false);
    setPendingImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`/api/admin/books?id=${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed");
      }

      showSuccess("Book deleted!");
      fetchBooks();
    } catch (error) {
      showError("Delete failed: " + error.message);
    }
  };

  const booksWithActions = books.map((book, index) => ({
    ...book,
    index: index + 1,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.manageBooks || "Manage Books"}</h2>
        <Button onClick={handleNewBook}>{t.addBook || "Add Book"}</Button>
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
          { accessorKey: "priceBeforeDiscount", header: "Old Price" },
          { accessorKey: "price", header: "Price" },
          { accessorKey: "inStock", header: "In Stock" },
          { accessorKey: "image", header: "Image" },
          { accessorKey: "actions", header: "Actions" },
        ]}
        data={booksWithActions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={(ids) => setBooks((prev) => prev.filter((b) => !ids.includes(b.book_id)))}
      />

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <Card className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl max-h-[90vh] flex flex-col">
            <CardContent className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                  X
                </Button>
              </div>

              <Input
                placeholder="English Title"
                value={formData.title_en || ""}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              />
              <Input
                placeholder="Arabic Title"
                value={formData.title_ar || ""}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
              />
              <Input
                placeholder="Author EN"
                value={formData.author_en || ""}
                onChange={(e) => setFormData({ ...formData, author_en: e.target.value })}
              />
              <Input
                placeholder="Author AR"
                value={formData.author_ar || ""}
                onChange={(e) => setFormData({ ...formData, author_ar: e.target.value })}
              />
              <Input
                placeholder="Publisher EN"
                value={formData.publishing_house_en || ""}
                onChange={(e) => setFormData({ ...formData, publishing_house_en: e.target.value })}
              />
              <Input
                placeholder="Publisher AR"
                value={formData.publishing_house_ar || ""}
                onChange={(e) => setFormData({ ...formData, publishing_house_ar: e.target.value })}
              />

              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryMapping).map((key) => (
                    <SelectItem key={key} value={key}>
                      {categoryMapping[key].en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Price"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
              />
              <Input
                type="number"
                placeholder="PriceBeforeDiscount"
                value={formData.priceBeforeDiscount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, priceBeforeDiscount: parseFloat(e.target.value) || 0 })
                }
              />

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (isEditing === "new") {
                      setPendingImageFile(file);
                      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
                    }
                  }}
                />
                {formData.image && (
                  <img
                    src={formData.image.startsWith("blob:") ? formData.image : formData.image}
                    alt="preview"
                    className="mt-2 max-h-48 w-full object-contain rounded border"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={!!formData.inStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </CardContent>

            {/* Fixed Button at Bottom */}
            <div className="p-6 pt-0">
              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                {isLoading ? <>Saving...</> : isEditing === "new" ? "Add Book" : "Update Book"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
