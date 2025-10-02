"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";
import ScrollToTop from "../components/BackToTop";
import { ArrowUp } from "lucide-react";
import CartSync from "../components/CartSync";

export default function ClientLayout({ children }) {
  return (
    <>
      <SessionProvider>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <LiveChat />
        <ScrollToTop
          minHeight={20}
          scrollTo={0}
          className="fixed right-4 bottom-4 bg-primary text-primary-foreground hover:bg-accent rounded-full w-14 h-14 flex items-center justify-center transition-colors"
        >
          <ArrowUp size={24} />
        </ScrollToTop>
        <CartSync />
      </SessionProvider>
    </>
  );
}
