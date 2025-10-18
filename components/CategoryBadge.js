"use client";

import { Badge } from "@/components/ui/badge";

const CategoryBadge = ({ category }) => {
  if (!category) return null;

  return (
    <Badge className="absolute top-3 left-3 bg-[#c0555f]/90 hover:bg-[#c0555f] text-white text-xs px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
      {category}
    </Badge>
  );
};

export default CategoryBadge;
