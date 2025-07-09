export default async function getMovieCredits(
  id: string
): Promise<MovieCredits> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data: MovieCredits = await response.json();
  return data;
}
