import MediaGrid from "@/components/MediaGrid";

const DefaultMovies = ({ movies }: { movies: Movies[] }) => {
  const getMovieCardProps = (movie: Movies, index: number) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    overview: movie.overview,
    voteAverage: movie.vote_average,
    href: `/movies/${movie.id}`,
    index,
  });

  return <MediaGrid items={movies} getMediaCardProps={getMovieCardProps} />;
};

export default DefaultMovies;
