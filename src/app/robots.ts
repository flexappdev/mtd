import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://moroccotopdestinations.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/auth", "/login", "/saved"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
