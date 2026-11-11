"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { artworkPlaceholder } from "@/lib/media";

export default function Artwork({ src, alt, ...props }: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(
    null,
  );
  const missing = src === artworkPlaceholder || failedSource === src;
  return (
    <Image
      {...props}
      src={missing ? artworkPlaceholder : src}
      alt={missing ? `${alt ? `${alt}: ` : ""}artwork unavailable` : alt}
      unoptimized={missing || props.unoptimized}
      onError={() => setFailedSource(src)}
    />
  );
}
