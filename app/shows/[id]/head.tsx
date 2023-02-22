import { getShow } from "./page";

export default async function ShowHead({ params }: { params: { id: string } }) {
  const show = await getShow(params.id);
  return (
    <>
      <title>{`CineScope | ${show.name || show.original_name}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for ${show.name || show.original_name}`}
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
