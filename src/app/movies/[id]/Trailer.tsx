"use client";

import { useState } from "react";

import TrailerModal from "./TrailerModal";
import { BsPlayCircle } from "react-icons/bs";

const Trailer = ({ movie }: { movie: Movie }) => {
  const [isOpen, setIsOpen] = useState(false);

  const trailer: Video | undefined = movie.videos.results.find(
    (video) => video.type === "Trailer"
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-sky-500 px-8 py-4 text-xl font-semibold transition-colors duration-200 hover:bg-sky-600 active:bg-sky-700"
      >
        <BsPlayCircle size={30} />
        Watch Trailer
      </button>
      <TrailerModal isOpen={isOpen} setIsOpen={setIsOpen} trailer={trailer} />
    </>
  );
};

export default Trailer;
