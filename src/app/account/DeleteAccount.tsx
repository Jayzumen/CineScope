"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  type User,
} from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { deleteAllLibraryData } from "@/lib/libraryStore";
import { authErrorMessage } from "@/lib/authErrors";
import { githubProvider, googleProvider } from "@/utils/providers";
// Deleting is permanent, so the person confirms their identity first. That
// also satisfies Firebase's recent-login requirement before deleteUser runs.
export default function DeleteAccount({
  user,
  db,
}: {
  user: User;
  db: Firestore;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const providerId = user.providerData[0]?.providerId ?? "password";
  const usesPassword = providerId === "password";
  async function confirm() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      if (usesPassword)
        await reauthenticateWithCredential(
          user,
          EmailAuthProvider.credential(user.email ?? "", password),
        );
      else
        await reauthenticateWithPopup(
          user,
          providerId === "github.com" ? githubProvider : googleProvider,
        );
      await deleteAllLibraryData(db, user.uid);
      await deleteUser(user);
      setOpen(false);
      toast.success("Your account and library have been deleted.");
      router.push("/");
    } catch (failure) {
      const text = authErrorMessage(failure, "login");
      if (text)
        setError(
          text.startsWith("Could not sign in")
            ? "Could not delete your account. Please try again."
            : text,
        );
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="section danger-zone">
      <h2 className="section-title">Delete account</h2>
      <p className="muted text-sm">
        Permanently removes your account, watchlist, watched titles, ratings and
        favorites. Share links you sent stay valid because they contain only
        public title IDs.
      </p>
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          setError("");
          setPassword("");
        }}
      >
        <Dialog.Trigger className="button subtle mt-4">
          Delete my account
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[61] w-[calc(100%_-_2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
            <Dialog.Title className="section-title">
              Delete your account?
            </Dialog.Title>
            <Dialog.Description className="muted my-3 text-sm">
              This cannot be undone. Confirm it’s you to continue.
            </Dialog.Description>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void confirm();
              }}
            >
              {usesPassword && (
                <label className="field">
                  Password
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              )}
              {error && (
                <p role="alert" className="alert">
                  {error}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="button" disabled={pending}>
                  {pending
                    ? "Deleting…"
                    : usesPassword
                      ? "Delete permanently"
                      : `Confirm with ${providerId === "github.com" ? "GitHub" : "Google"} and delete`}
                </button>
                <Dialog.Close className="button subtle" type="button">
                  Cancel
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
