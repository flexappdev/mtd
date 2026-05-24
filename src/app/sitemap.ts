import type { MetadataRoute } from "next";
import { DESTINATIONS } from "@/lib/mtd-v2/seed";

const PUBLIC_ROUTES = [
  "/",
  "/places",
  "/places/regions",
  "/places/cities",
  "/places/sights",
  "/places/hotels",
  "/places/restaurants",
  "/lists",
  "/lists/top100",
  "/lists/cities",
  "/lists/hotels",
  "/lists/food",
  "/lists/all",
  "/wiki",
  "/media",
  "/media/images",
  "/media/audio",
  "/media/videos",
  "/media/map",
  "/media/pdf",
  "/guides",
  "/guides/books",
  "/guides/cookbooks",
  "/guides/gear",
  "/guides/beauty",
  "/moroccai",
  "/morocco",
  "/apps",
  "/videos",
  "/github",
  "/prompts",
  "/scroller",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://moroccotopdestinations.com";
  const now = new Date();
  const top = PUBLIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const destinations = DESTINATIONS.map((d) => ({
    url: `${base}/morocco/${d.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...top, ...destinations];
}
