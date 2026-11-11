import DetailPage, { detailMetadata } from "@/components/DetailPage";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return detailMetadata("movie", (await params).id);
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ region?: string }>;
}) {
  return (
    <DetailPage
      kind="movie"
      id={(await params).id}
      region={(await searchParams).region}
    />
  );
}
