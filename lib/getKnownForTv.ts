export default async function getKnownForTv(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data.cast as TvRole[];
}
