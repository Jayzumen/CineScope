import Navbar from "@/components/Navbar";
import "./globals.css";

import type { Metadata } from "next";

import { Inter, Great_Vibes } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import ToastUtils from "@/components/ToastUtils";

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
  description: "A movie and TV show search engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${greatVibes.variable} flex min-h-screen flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Navbar />

          <main>{children}</main>

          <ToastUtils />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
