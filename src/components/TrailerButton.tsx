"use client";
import { useHydrated } from "@/hooks/use-hydrated";
import * as Dialog from "@radix-ui/react-dialog";
import { Play } from "lucide-react";
import { selectTrailer, type TrailerVideo } from "@/lib/media";
import TrailerModal from "./TrailerModal";
export default function TrailerButton({
  videos,
  title,
}: {
  videos?: { results: TrailerVideo[] };
  title: string;
}) {
  const hydrated = useHydrated();
  const trailer = selectTrailer(videos?.results);
  if (!trailer) return null;
  return (
    <Dialog.Root>
      <Dialog.Trigger className="button" disabled={!hydrated}>
        <Play size={16} fill="currentColor" aria-hidden />
        {trailer.official ? "Watch trailer" : "Play trailer"}
      </Dialog.Trigger>
      <TrailerModal trailer={trailer} title={title} />
    </Dialog.Root>
  );
}
