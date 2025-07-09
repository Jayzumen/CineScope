export default async function getShowCredits(id: string): Promise<ShowCredits> {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data: ShowCredits = await response.json();
  return data;
}
