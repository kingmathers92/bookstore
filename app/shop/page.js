"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import translations from "@/lib/translations";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import SortFilter from "@/components/SortFilter";
import ReactPaginate from "react-paginate";

const PAGE_SIZE = 10;
const PAGINATION_CHUNK = 50;

const getInfiniteKey = (
  pageIndex,
  previousPageData,
  searchQuery,
  category,
  priceRange,
  language,
  sortOrder,
) => {
  if (previousPageData && !previousPageData.length) return null;
  return `books_page_${pageIndex}_query_${searchQuery}_cat_${category}_min_${priceRange[0]}_max_${priceRange[1]}_lang_${language}_sort_${sortOrder}`;
};

const infiniteFetcher = async (key) => {
  const parts = key.split("_");
  const pageIndex = parseInt(parts[2]);
  const query = parts[4];
  const cat = parts[6];
  const min = parseFloat(parts[8]);
  const max = parseFloat(parts[10]);
  const lang = parts[12];
  const sort = parts[14];

  const titleField = lang === "ar" ? "title_ar" : "title_en";
  const catField = lang === "ar" ? "category_ar" : "category_en";

  let sbQuery = supabase
    .from("books")
    .select(
      `
      book_id,
      title_en,
      title_ar,
      category_en,
      category_ar,
      price,
      priceBeforeDiscount,
      image,
      inStock,
      author_en,
      author_ar,
      publishing_house_en,
      publishing_house_ar,
      created_at
    `,
    )
    .order("created_at", { ascending: sort === "oldest" });

  if (query) sbQuery = sbQuery.ilike(titleField, `%${query}%`);
  if (cat !== "all") sbQuery = sbQuery.eq(catField, cat);
  sbQuery = sbQuery.or(`price.is.null, and(price.gte.${min || 0}, price.lte.${max || 1000})`);

  sbQuery = sbQuery.range(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE - 1);

  const { data, error } = await sbQuery;
  if (error) throw new Error(`Error fetching books: ${error.message}`);
  return data || [];
};

const getCountKey = (searchQuery, category, priceRange, language) => {
  return `book_count_query_${searchQuery}_cat_${category}_min_${priceRange[0]}_max_${priceRange[1]}_lang_${language}`;
};

const countFetcher = async (key) => {
  const parts = key.split("_");
  const query = parts[3];
  const cat = parts[5];
  const min = parseFloat(parts[7]);
  const max = parseFloat(parts[9]);
  const lang = parts[11];

  const titleField = lang === "ar" ? "title_ar" : "title_en";
  const catField = lang === "ar" ? "category_ar" : "category_en";

  let sbQuery = supabase.from("books").select("count", { count: "exact", head: true });

  if (query) sbQuery = sbQuery.ilike(titleField, `%${query}%`);
  if (cat !== "all") sbQuery = sbQuery.eq(catField, cat);
  sbQuery = sbQuery.or(`price.is.null, and(price.gte.${min || 0}, price.lte.${max || 1000})`);

  const { count, error } = await sbQuery;
  if (error) throw new Error(`Error fetching count: ${error.message}`);
  return count || 0;
};

export default function Shop() {
  const {
    searchQuery = "",
    category = "all",
    priceRange = [0, 1000],
    language,
    isTyping = false,
  } = useStore();
  const t = translations[language] || translations.ar;
  const [sortOrder, setSortOrder] = useState("newest");

  const getKeyWrapper = (pageIndex, previousPageData) =>
    getInfiniteKey(
      pageIndex,
      previousPageData,
      searchQuery,
      category,
      priceRange,
      language,
      sortOrder,
    );

  const { data, error, isLoading, size, setSize, isValidating } = useSWRInfinite(
    getKeyWrapper,
    infiniteFetcher,
    {
      revalidateFirstPage: false,
      refreshInterval: 300000,
    },
  );

  const books = useMemo(() => (data ? data.flat() : []), [data]);

  const hasMore = data && data[data.length - 1]?.length === PAGE_SIZE;

  const countKey = getCountKey(searchQuery, category, priceRange, language);
  const { data: totalCount = 0 } = useSWR(countKey, countFetcher);

  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isValidating) {
          setSize(size + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isValidating, size, setSize]);

  useEffect(() => {
    setSize(1);
  }, [searchQuery, category, priceRange, language, sortOrder, setSize]);

  if (isLoading && size === 1) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <section className="container mx-auto py-12 px-4" aria-label={t.title}>
        <h2 className="text-4xl font-bold text-center mb-8 mt-16 text-burgundy md:text-5xl">
          {t.title}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:gap-6">
          <SearchBar />
          <CategoryFilter />
          <SortFilter sortOrder={sortOrder} setSortOrder={setSortOrder} language={language} />
          <PriceRangeFilter />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book.book_id}
                id={book.book_id}
                title_en={book.title_en}
                title_ar={book.title_ar}
                category_en={book.category_en}
                category_ar={book.category_ar}
                price={book.price || 0}
                priceBeforeDiscount={book.priceBeforeDiscount || 0}
                image={book.image}
                inStock={book.inStock}
                author_en={book.author_en}
                author_ar={book.author_ar}
                publishing_house_en={book.publishing_house_en}
                publishing_house_ar={book.publishing_house_ar}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-warm-gray-600 font-serif">
              {t.noBooksFound || "لا توجد كتب تطابق بحثك"}
            </div>
          )}
        </div>

        {hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center h-20 mt-8">
            {isValidating && <LoadingSpinner />}
          </div>
        )}

        {isTyping && (
          <div className="text-center text-muted-foreground mt-6 flex items-center justify-center">
            <span className="dot-flashing"></span>
            <span className="dot-flashing" style={{ animationDelay: "0.2s" }}></span>
            <span className="dot-flashing" style={{ animationDelay: "0.4s" }}></span>
            <span className="ml-2">{language === "ar" ? "جاري الكتابة..." : "Typing..."}</span>
          </div>
        )}

        {totalCount > 0 && (
          <ReactPaginate
            pageCount={Math.ceil(totalCount / PAGINATION_CHUNK)}
            onPageChange={({ selected }) =>
              setSize((selected + 1) * (PAGINATION_CHUNK / PAGE_SIZE))
            }
            containerClassName="flex justify-center mt-8 space-x-2"
            pageLinkClassName="px-4 py-2 border border-burgundy text-burgundy rounded-md hover:bg-burgundy hover:text-white transition-colors font-medium"
            activeLinkClassName="bg-burgundy text-white"
            previousLinkClassName="px-4 py-2 border border-burgundy text-burgundy rounded-md hover:bg-burgundy hover:text-white transition-colors font-medium"
            nextLinkClassName="px-4 py-2 border border-burgundy text-burgundy rounded-md hover:bg-burgundy hover:text-white transition-colors font-medium"
            breakLinkClassName="px-4 py-2 text-burgundy"
            previousLabel={language === "ar" ? "السابق" : "Previous"}
            nextLabel={language === "ar" ? "التالي" : "Next"}
            breakLabel="..."
          />
        )}
      </section>
    </div>
  );
}
