import "./globals.css";

import { Metadata } from "next";
import Navbar from "./components/Navbar";
import ToastUtils from "./components/ToastUtils";
import { Inter, Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${inter.variable} ${greatVibes.variable}`}>
      <head />
      <body className="flex min-h-screen flex-col bg-black font-inter text-white">
        <Navbar />
        <main>{children}</main>
        <ToastUtils />
      </body>
    </html>
  );
}
