import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LibraryProvider } from "@/components/LibraryProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";
import "./globals.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "CineScope — Find your next great story",
    template: "%s · CineScope",
  },
  description:
    "Discover films, explore series, and build a watchlist that is entirely yours.",
  openGraph: {
    type: "website",
    siteName: "CineScope",
    title: "CineScope — Find your next great story",
    description: "A considered collection of cinema and television.",
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <LibraryProvider>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <Navbar />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <Toaster
              theme="dark"
              richColors
              position="bottom-right"
              toastOptions={{ className: "toast" }}
            />
          </LibraryProvider>
        </AuthProvider>
        <script
          suppressHydrationWarning
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CineScope",
              url: process.env.SITE_URL || "http://localhost:3000",
            }),
          }}
        />
      </body>
    </html>
  );
}
