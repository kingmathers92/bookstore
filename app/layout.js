import "./globals.css";
import { Noto_Kufi_Arabic, Amiri } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    "متجر كتب إسلامية عبر الإنترنت يقدم مجموعة واسعة من الكتب الإسلامية باللغة العربية.",
  keywords: "كتب إسلامية, متجر كتب, ثمرات الأوراق, كتب دينية",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${notoKufi.variable} ${amiri.variable}`}
    >
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
