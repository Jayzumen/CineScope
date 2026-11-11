import { headers } from "next/headers";
import GlobalSearch from "@/components/GlobalSearch";
export const metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};
export default async function Page() {
  return (
    <div className="shell search-layout">
      <div className="page-top">
        <p className="eyebrow">Follow your curiosity</p>
        <h1>Every story starts somewhere.</h1>
        <p>Movies, series, and people. One search.</p>
      </div>
      <GlobalSearch nonce={(await headers()).get("x-nonce") ?? undefined} />
    </div>
  );
}
