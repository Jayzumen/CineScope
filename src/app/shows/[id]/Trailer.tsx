"use client";

import TrailerButton from "@/components/TrailerButton";

const ShowTrailer = ({ show }: { show: Show }) => {
  return <TrailerButton videos={show.videos} title={show.name} />;
};

export default ShowTrailer;
