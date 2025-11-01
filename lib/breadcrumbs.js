import translations from "@/lib/translations";

export function generateBreadcrumbs(pathname = "/", language = "en") {
  const t = translations[language] || translations.en;
  const segments = String(pathname).split("/").filter(Boolean);
  const breadcrumbs = [{ label: t.home || "Home", href: "/" }];

  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    const label = formatSegmentLabel(segments[i], language, t);
    breadcrumbs.push({ label, href: currentPath });
  }

  return breadcrumbs;
}

function formatSegmentLabel(segment, language, t) {
  const staticRouteLabels = {
    about: t.aboutUs || (language === "ar" ? "من نحن" : "About"),
    contact: t.contactUs || (language === "ar" ? "اتصل بنا" : "Contact"),
    shop: t.shop || (language === "ar" ? "المتجر" : "Shop"),
    books: language === "ar" ? "كتب" : "Books",
    blog: language === "ar" ? "المدونة" : "Blog",
    cart: t.cartTitle || (language === "ar" ? "السلة" : "Cart"),
    wishlist: t.myWishlist || (language === "ar" ? "قائمة الرغبات" : "Wishlist"),
    testimonial: language === "ar" ? "الشهادات" : "Testimonials",
  };

  if (staticRouteLabels[segment]) return staticRouteLabels[segment];

  if (/^\d+$/.test(segment) || /^[0-9a-fA-F-]{8,}$/.test(segment)) {
    return language === "ar" ? "تفاصيل" : "Details";
  }

  return segment
    .replace(/_/g, " ")
    .split("-")
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}
