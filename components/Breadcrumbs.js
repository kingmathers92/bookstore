"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";
import { Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  const { language } = useStore();
  const crumbs = generateBreadcrumbs(pathname, language);

  const separator = language === "ar" ? "‹" : "›";
  const dir = language === "ar" ? "rtl" : "ltr";
  const alignClass = language === "ar" ? "justify-end" : "justify-start";

  return (
    <nav aria-label="Breadcrumb" className={`absolute w-60 mt-25 mb-6 ${alignClass}`} dir={dir}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
        <li className="flex items-center gap-1">
          <Link
            href="/"
            className="text-primary font-medium hover:text-primary/80 flex items-center gap-1"
          >
            <Home size={16} className="inline" />
            {language === "ar" ? "الرئيسية" : "Home"}
          </Link>
        </li>

        {crumbs.slice(1).map((crumb, index) => {
          const isLast = index === crumbs.length - 2;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              <span className="text-gray-400">{separator}</span>
              {isLast ? (
                <span className="text-burgundy font-semibold">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-burgundy transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
