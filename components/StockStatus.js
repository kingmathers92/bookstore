"use client";

const StockStatus = ({ inStock, language }) => {
  if (inStock === undefined) return null;

  const text = inStock
    ? language === "ar"
      ? "متوفر"
      : "In Stock"
    : language === "ar"
      ? "غير متوفر"
      : "Out of Stock";

  const colorClass = inStock
    ? "text-green-600 bg-green-50 border border-green-200"
    : "text-gray-500 bg-gray-100 border border-gray-200";

  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 mt-1 rounded-md ${colorClass}`}>
      {text}
    </span>
  );
};

export default StockStatus;
