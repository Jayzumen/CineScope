import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-slate-900 text-white">
        <main>{children}</main>
      </body>
    </html>
  );
}
