import { Suspense } from "react";
import ShopClient from "./ShopClient"; // Adjust path if needed
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Shop({ searchParams }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ShopClient searchParams={searchParams} />
    </Suspense>
  );
}
