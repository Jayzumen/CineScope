"use client";

import LikeButton from "@/components/LikeButton";

const ShowLikeButton = ({ show }: { show: Show }) => {
  return <LikeButton item={show} collectionName="likedShows" itemName="show" />;
};

export default ShowLikeButton;
