"use client";

import { useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initializeLocalStorage } from "@/lib/storage";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}