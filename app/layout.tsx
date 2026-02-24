import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/app/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import ProgressBar from "@/app/components/ProgressBar";
const font = Quicksand({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LMS Pro - Learning Management System",
  description: "Advanced LMS platform build with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${font.className} antialiased`}>
        <QueryProvider>
          <Toaster position="top-right" />

          {children}
        </QueryProvider>{" "}
      </body>
    </html>
  );
}
