import ClientLayout from "./client-layout";

export const metadata = {
  title: "ثمرات الأوراق - متجر الكتب الإسلامية",
  description: "اكتشف مجموعة واسعة من الكتب الإسلامية عالية الجودة في متجر ثمرات الأوراق.",
  keywords: "كتب إسلامية, متجر كتب, ثمرات الأوراق, كتب دينية, قرآن, حديث, تفسير",
  metadataBase: new URL("https://thamaratalawrak.com"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    android: "/android-chrome-192x192.png",
  },
  openGraph: {
    title: "ثمرات الأوراق",
    description: "متجر الكتب الإسلامية الأفضل عبر الإنترنت.",
    url: "https://thamaratalawrak.com",
    images: [
      {
        url: "/images/hero.jpg",
        width: 800,
        height: 600,
        alt: "شعار متجر ثمرات الأوراق",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ثمرات الأوراق",
    description: "اكتشف الكتب الإسلامية المميزة!",
    images: ["/images/hero.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: "no",
};

export default function RootLayout({ children }) {
  const language = typeof window !== "undefined" ? localStorage.getItem("language") || "en" : "en";
  return (
    <html
      className="flex flex-col min-h-screen"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <body className="flex flex-col min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
