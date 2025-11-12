Thamarat Al-Awrak - Islamic Book Store
======================================

Welcome to **Thamarat Al-Awrak** (ثمرات الأوراق), an online e-commerce platform for Islamic books, built with Next.js and Supabase. This app provides a user-friendly store for browsing, searching, and purchasing Arabic Islamic literature, with features like cart management, wishlist, order processing, and admin tools. The design draws inspiration from modern themes, featuring RTL support for Arabic, elegant animations, and a custom Islamic color scheme (burgundy, cream, warm gray).

[Thamarat Al-Awrak Screenshot](public/images/sreen.png)

Overview
--------

Thamarat Al-Awrak, meaning "Fruits of the Pages," symbolizes the wisdom derived from Islamic texts. The app focuses on a seamless shopping experience for books in categories like Quran, Hadith, Fiqh, and more. It includes bilingual support (Arabic/English), secure authentication, and backend integration for real-time data.

*   **Tech Stack**: Next.js (App Router), Supabase (Database & Auth), Next-Auth (Google Login), Zustand (State Management), SWR (Data Fetching), shadcn/ui & Tailwind CSS (UI/Styling), Framer Motion (Animations)

*   **Language**: JavaScript/TypeScript

*   **Direction**: RTL for Arabic, LTR for English (dynamic switch)

*   **Deployment**: Optimized for Vercel/Next.js hosting

*   **Key Integrations**: Supabase Storage for images, API routes for CRUD operations


Features
--------

*   **Homepage**: Hero section with featured "Book of the Day," marketing highlights (e.g., delivery info), testimonials carousel, and testimonial submission form (for logged-in users).

*   **Shop Page**: Infinite scrolling book catalog with search, category filters, price range slider, and sorting (newest/oldest). Supports author/publisher filtering via query params.

*   **Book Detail Page**: Detailed view with images, descriptions, pricing (discounts), stock status, quantity selector, add to cart/wishlist, and notification preferences.

*   **Cart**: Dynamic cart with quantity updates, removals, subtotal/shipping calculations, and order confirmation form (name, address, phone).

*   **Wishlist**: Persistent localStorage wishlist with add/remove functionality.

*   **Authentication**: Google Sign-In integrated with Supabase users; role-based (user/admin).

*   **Admin Dashboard**: Books CRUD (add/edit/delete with image upload), orders management (status updates, archive).

*   **UI/UX**: Responsive design, loading spinners, toasts, live chat bot, back-to-top button, breadcrumbs, animations.

*   **Performance**: Server components for static pages, Suspense for loading states, dynamic imports for heavy components, image optimization.

*   **Internationalization**: Bilingual (Arabic/English) with dynamic RTL/LTR switching.

*   **API Routes**: Secure endpoints for books/orders management, file uploads.


Usage
-----

*   **Browse & Shop**: Visit /shop to filter/search books. Click author/publisher for filtered views.

*   **Cart & Checkout**: Add items, update quantities, submit orders.

*   **Wishlist**: Add/remove books; persists via localStorage.

*   **Admin**: Login as admin, manage books/orders at /admin.

*   **Language Switch**: Toggle Arabic/English; auto RTL.

*   **Live Chat**: Predefined Q&A bot for common queries.


Performance Optimizations
-------------------------

*   Server-side rendering for static pages (e.g., Home, Testimonials).

*   Dynamic imports for heavy components to reduce bundle size.

*   Suspense boundaries with custom loading spinners.

*   Image optimization via Next.js  (AVIF/WebP, lazy loading).

*   Caching for Supabase queries and SWR for client data.

*   Minified JS/CSS in production; split chunks in webpack.


Lighthouse scores: Improved to 60+ on mobile/desktop after optimizations (e.g., reduced TBT/LCP via server components).

Future Features
---------------

*   Advanced admin analytics (sales reports).

*   Email notifications for orders/stock.

*   Multi-currency support.


_Last updated: November 15, 2025_

Contributing
------------

1.  Fork the repo.

2.  Create branch: git checkout -b feature/your-feature.

3.  Commit: git commit -m "Add feature".

4.  Push: git push origin feature/your-feature.

5.  Open PR.


Follow ESLint/Prettier; add tests for new features.

License
-------

MIT License - see LICENSE for details.


Contact: [info@thamaratalawrak.com](mailto:info@thamaratalawrak.com)