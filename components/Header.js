import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-green-900 text-cream-100 py-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gold-300">ثمرات الأوراق</h1>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="hover:text-gold-300 transition-colors text-lg"
          >
            الرئيسية
          </Link>
          <Link
            href="/shop"
            className="hover:text-gold-300 transition-colors text-lg"
          >
            المتجر
          </Link>
          <Link
            href="/cart"
            className="hover:text-gold-300 transition-colors text-lg"
          >
            السلة
          </Link>
        </nav>
      </div>
    </header>
  );
}
