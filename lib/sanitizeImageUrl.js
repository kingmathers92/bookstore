export function sanitizeImageUrl(url) {
  if (!url) return "/images/placeholder.png";
  if (url.startsWith("blob:") || url.startsWith("file:")) {
    return "/images/placeholder.png";
  }
  if (url.startsWith("http")) {
    return url;
  }
  if (url.startsWith("/storage/v1/object/public/")) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}${url}`;
  }
  return "/images/placeholder.png";
}
