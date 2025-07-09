"use client";

import TrailerButton from "@/components/TrailerButton";

const MovieTrailer = ({ movie }: { movie: Movie }) => {
  return <TrailerButton videos={movie.videos} title={movie.title} />;
};

export default MovieTrailer;
