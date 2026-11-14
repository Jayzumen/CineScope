import type { MetadataRoute } from "next";
import { collections } from "@/lib/catalogTypes";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!process.env.SITE_URL) return [];
  const siteUrl = process.env.SITE_URL.replace(/\/$/, "");
  return [
    "",
    "/movies",
    "/shows",
    ...collections.map((c) => `/collections/${c.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path ? 0.7 : 1,
  }));
}
