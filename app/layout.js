import "./globals.css";
import { Noto_Kufi_Arabic, Amiri } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-primary",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-secondary",
});

export const metadata = {
  title: "ثمرات الأوراق - متجر الكتب الإسلامية",
  description:
    "اكتشف مجموعة واسعة من الكتب الإسلامية عالية الجودة في متجر ثمرات الأوراق.",
  keywords:
    "كتب إسلامية, متجر كتب, ثمرات الأوراق, كتب دينية, قرآن, حديث, تفسير",
  openGraph: {
    title: "ثمرات الأوراق",
    description: "متجر الكتب الإسلامية الأفضل عبر الإنترنت.",
    url: "https://thamaratalawrak.com",
    images: [
      {
        url: "/images/hero.webp",
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
    images: ["/images/hero.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <LiveChat />
      </body>
    </html>
  );
}
