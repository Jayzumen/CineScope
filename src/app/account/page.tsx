import { Metadata } from "next";
import AccountDetails from "./AccountDetails";

export const metadata: Metadata = {
  title: "CineScope | Your Account",
  description: "Account Page",
};

export default async function AccountPage() {
  return (
    <main className="p-10 text-center">
      <AccountDetails />
    </main>
  );
}
