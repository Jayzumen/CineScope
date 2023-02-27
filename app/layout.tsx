import "./globals.css";

import { Metadata } from "next";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "CineScope",
  description: "A movie search engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
