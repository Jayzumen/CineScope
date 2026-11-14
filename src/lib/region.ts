// Chooses the watch-availability region. Every source is user-controllable,
// which is fine: the region only picks which public availability to show.
const valid = (value: unknown) => {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  return code && /^[A-Z]{2}$/.test(code) ? code : undefined;
};
/** Region subtag of the most preferred language that has one ("de-AT" → AT). */
export function regionFromAcceptLanguage(header: string | null | undefined) {
  if (!header || header.length > 500) return undefined;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const weight = q ? Number(q.trim().slice(2)) : 1;
      return { tag, weight: Number.isFinite(weight) ? weight : 0, index };
    })
    .filter((x) => x.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  for (const { tag } of ranked) {
    const region = valid(/^[a-z]{2,3}-([a-z]{2})(?:-|$)/i.exec(tag)?.[1]);
    if (region) return region;
  }
  return undefined;
}
export function pickRegion(sources: {
  query?: string | string[];
  cookie?: string;
  geo?: string | null;
  acceptLanguage?: string | null;
}) {
  return (
    valid(sources.query) ??
    valid(sources.cookie) ??
    valid(sources.geo) ??
    regionFromAcceptLanguage(sources.acceptLanguage) ??
    "US"
  );
}
export function regionName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
export const REGION_COOKIE = "region";
export const isRegionCode = (value: string | null | undefined) =>
  !!value && /^[A-Z]{2}$/.test(value);
