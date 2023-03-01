"use client";

import { Movie, Video } from "../movieTypes";
import { useState } from "react";

import TrailerModal from "./TrailerModal";

const Trailer = ({ movie }: { movie: Movie }) => {
  const [isOpen, setIsOpen] = useState(false);

  const trailer: Video | undefined = movie.videos.results.find(
    (video) => video.type === "Trailer"
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-slate-500 py-4 px-8 text-xl font-semibold"
      >
        Watch Trailer
      </button>
      <TrailerModal isOpen={isOpen} setIsOpen={setIsOpen} trailer={trailer} />
    </>
  );
};

export default Trailer;
