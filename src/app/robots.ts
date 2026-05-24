import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://moroccotopdestinations.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin", "/auth", "/login"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
