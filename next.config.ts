import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    // Keep the optimizer limited to the sizes and host used by our artwork helper.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w500/*",
        search: "",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w1280/*",
        search: "",
      },
    ],
    qualities: [75],
    minimumCacheTTL: 86400,
  },
};
export default nextConfig;
