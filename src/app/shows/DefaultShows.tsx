import MediaGrid from "@/components/MediaGrid";

const DefaultShows = ({ shows }: { shows: Shows[] }) => {
  const getShowCardProps = (show: Shows, index: number) => ({
    id: show.id,
    title: show.name,
    originalTitle: show.original_name,
    posterPath: show.poster_path,
    releaseDate: show.first_air_date,
    overview: show.overview,
    voteAverage: show.vote_average,
    href: `/shows/${show.id}`,
    index,
  });

  return <MediaGrid items={shows} getMediaCardProps={getShowCardProps} />;
};

export default DefaultShows;
