import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CineScope — Find your next great story",
    short_name: "CineScope",
    description:
      "Discover films, explore series, and build a private watchlist.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#101113",
    theme_color: "#101113",
    categories: ["entertainment", "lifestyle"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
