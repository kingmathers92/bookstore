"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  const { language } = useStore();
  const crumbs = generateBreadcrumbs(pathname, language);

  const separator = language === "ar" ? "‹" : "›";
  const dir = language === "ar" ? "rtl" : "ltr";
  const alignClass = language === "ar" ? "justify-end" : "justify-start";

  return (
    <nav aria-label="Breadcrumb" className={`mt-16 w-full ${alignClass}`} dir={dir}>
      <ol className="inline-flex items-center gap-2 text-sm text-gray-700">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="inline-flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">{separator}</span>}

              {isLast ? (
                <span
                  aria-current="page"
                  className="text-primary font-semibold underline decoration-primary decoration-1"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
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
