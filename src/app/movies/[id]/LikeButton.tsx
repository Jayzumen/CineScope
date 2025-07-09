"use client";

import LikeButton from "@/components/LikeButton";

const MovieLikeButton = ({ movie }: { movie: Movie }) => {
  return (
    <LikeButton item={movie} collectionName="likedMovies" itemName="movie" />
  );
};

export default MovieLikeButton;
