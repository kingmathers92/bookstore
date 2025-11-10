import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import WishlistClient from "@/components/WishlistClient";

export default function WishlistPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WishlistClient />
    </Suspense>
  );
}