import "./globals.css";

export const metadata = {
  title: "ثمرات الأوراق - متجر الكتب الإسلامية",
  description:
    "متجر كتب إسلامية عبر الإنترنت يقدم مجموعة واسعة من الكتب الإسلامية باللغة العربية.",
  keywords: "كتب إسلامية, متجر كتب, ثمرات الأوراق, كتب دينية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
