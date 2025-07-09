import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineScope | Your Account",
  description: "Account Page",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
