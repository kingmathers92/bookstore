export default function Footer() {
  return (
    <footer className="bg-green-900 text-cream-100 py-6">
      <div className="container mx-auto text-center">
        <p className="mb-2 text-lg">&copy; 2025 ثمرات الأوراق</p>
        <p className="text-sm">
          اتصل بنا:{" "}
          <a
            href="mailto:info@thamaratalawrak.com"
            className="hover:text-gold-300"
          >
            info@thamaratalawrak.com
          </a>{" "}
          | +123 456 789
        </p>
      </div>
    </footer>
  );
}
