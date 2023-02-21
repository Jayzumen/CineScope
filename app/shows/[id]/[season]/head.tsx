export default function ShowHead({
  params,
}: {
  params: { id: string; season: string };
}) {
  return (
    <>
      <title>{`CineScope | ${params.id}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`Page for ${params.id}`} />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
