"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import AccountDetails from "./AccountDetails";

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex min-h-screen flex-col items-center justify-center p-10">
          <div className="text-center">
            <h1 className="mb-8 bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl">
              Account
            </h1>
            <p className="text-xl text-slate-300">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex min-h-screen flex-col items-center justify-center p-10">
        <AccountDetails />
      </div>
    </main>
  );
}
