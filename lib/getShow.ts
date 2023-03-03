export default async function getShow(id: string): Promise<Show> {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=videos`
  );
  const data: Show = await response.json();
  return data;
}
