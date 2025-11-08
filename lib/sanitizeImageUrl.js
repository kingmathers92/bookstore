export function sanitizeImageUrl(url) {
  if (!url) return "/images/placeholder.png";

  // Prevent blob or local resources from breaking
  if (url.startsWith("blob:") || url.startsWith("file:")) {
    return "/images/placeholder.png";
  }

  // Ensure valid remote URLs or Supabase paths
  if (url.startsWith("http")) {
    return url;
  }

  // Handle Supabase storage relative paths
  if (url.startsWith("/storage/v1/object/public/")) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}${url}`;
  }

  // Fallback
  return "/images/placeholder.png";
}
