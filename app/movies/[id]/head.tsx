import { getMovie } from "@/app/getData";

export default async function MovieHead({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);
  return (
    <>
      <title>{`CineScope | ${movie.title || movie.original_title}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for ${movie.title || movie.original_title}`}
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
