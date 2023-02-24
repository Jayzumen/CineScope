import "./globals.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineScope",
  description: "A movie search engine",
  icons: "/favicon.ico",
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
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
