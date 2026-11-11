"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { TrailerVideo } from "@/lib/media";

export default function TrailerModal({
  trailer,
  title,
}: {
  trailer: TrailerVideo;
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-[61] max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-4 shadow-2xl sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <Dialog.Title className="text-lg font-semibold text-white">
            {title} — trailer
          </Dialog.Title>
          <Dialog.Close
            aria-label="Close trailer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X aria-hidden />
          </Dialog.Close>
        </div>
        <Dialog.Description className="mb-4 text-sm text-slate-400">
          Video hosted on YouTube. Use the player controls for playback, sound,
          and captions.
        </Dialog.Description>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            className="h-full w-full"
            title={`${title} trailer`}
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&mute=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${trailer.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-sm text-sky-300 underline underline-offset-4 focus-visible:outline-2"
        >
          Open on YouTube if playback is unavailable
        </a>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
