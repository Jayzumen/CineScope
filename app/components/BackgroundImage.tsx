import Image from "next/image";
import React from "react";
import { baseUrl } from "../constants";
import { Movie } from "../movies/types";

function BackgroundImage({ randomMovie }: { randomMovie: Movie }) {
  return (
    <div className="absolute inset-0 -z-10 h-[120vh] w-full">
      <Image
        className="object-cover opacity-40"
        fill={true}
        src={`${baseUrl}${
          randomMovie?.backdrop_path || randomMovie?.poster_path
        }`}
        priority
        alt={
          randomMovie?.title ||
          randomMovie?.title ||
          randomMovie?.original_title
        }
      />
    </div>
  );
}

export default BackgroundImage;
