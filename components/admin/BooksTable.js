"use client";

import { useState, useEffect, useRef } from "react";
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
import { Loader2 } from "lucide-react";
import translations from "@/lib/translations";

export default function BooksTable() {
  const { language, user } = useStore();
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

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await handleSave();
    } finally {
      setIsLoading(false);
    }
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl = existingImageUrl || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `books/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("book_images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("book_images").getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            title,
            author,
            category,
            description,
            price,
            image_url: imageUrl,
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Book added successfully!");
      onClose();
    } catch (err) {
      console.error("Error saving book:", err.message);
      toast.error("Error saving book");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (isEditing === "new") {
      setPendingImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: previewUrl }));
      return;
    }

    const bookId = isEditing && isEditing !== "new" ? isEditing : null;
    if (!bookId) {
      showError("Please save the book first before uploading an image");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("filename", `books/${Date.now()}_${file.name}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || body?.message || "Upload failed");

      console.log("Image uploaded:", body);

      const imageUrl = body.publicUrl || body.path || body?.data?.publicUrl;
      const updateRes = await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          image: imageUrl,
        }),
      });

      const updateJson = await updateRes.json().catch(() => null);
      if (!updateRes.ok) {
        throw new Error(
          updateJson?.error || updateJson?.message || `Update failed (${updateRes.status})`,
        );
      }

      showSuccess("Image updated successfully!");
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      fetchBooks();
    } catch (err) {
      console.error("Image upload error:", err);
      showError(`Image upload failed: ${err.message || err}`);
    }
  };

  const handleCloseModal = () => {
    setIsEditing(null);
    setFormData({});
    setIsModalOpen(false);
    setPendingImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          <Card className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <CardContent className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="hover:bg-gray-100 rounded-full p-1"
                >
                  X
                </Button>
              </div>

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
                  onChange={(e) =>
                    setFormData({ ...formData, publishing_house_en: e.target.value })
                  }
                />
                <Input
                  placeholder={t.publisherAr || "Publisher AR"}
                  value={formData.publishing_house_ar || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, publishing_house_ar: e.target.value })
                  }
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
                    <SelectItem value="creed">Creed</SelectItem>
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
                  placeholder={t.price || "Price"}
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                />

                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="w-full text-sm"
                  />
                  {formData.image && (
                    <div className="flex justify-center p-2 bg-gray-50 rounded-lg">
                      <img
                        src={formData.image}
                        alt="Book preview"
                        className="max-h-48 w-auto rounded-md border border-gray-300 object-contain shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={!!formData.inStock}
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                  />
                  <Label htmlFor="inStock" className="text-sm font-medium">
                    {t.inStock || "In Stock"}
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleClick}
                disabled={isLoading}
                className="relative mt-6 w-full flex items-center justify-center gap-2 py-3 text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t.addingBook}</span>
                  </>
                ) : (
                  t.addBook || "Add Book"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
