export default async function getMovie(id: string): Promise<Movie> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=videos`
  );
  const data: Movie = await response.json();
  return data;
}
