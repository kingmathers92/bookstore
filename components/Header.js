import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-green-900 text-cream-100 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold">ثمرات الأوراق</h1>
        <nav className="flex gap-6">
          <Link href="/" className="hover:text-gold-300 transition-colors">
            الرئيسية
          </Link>
          <Link href="/shop" className="hover:text-gold-300 transition-colors">
            المتجر
          </Link>
          <Link href="/cart" className="hover:text-gold-300 transition-colors">
            السلة
          </Link>
        </nav>
      </div>
    </header>
  );
}
