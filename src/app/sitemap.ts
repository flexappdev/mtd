import type { MetadataRoute } from "next";
import { DESTINATIONS, LISTS, REGIONS } from "@/lib/mtd-v2/seed";
import { listArticles } from "@/lib/wikivoyage";
import { listItems as listTopics } from "@/lib/wikipedia-morocco";
import { getSiteVideos } from "@/lib/travel-videos";

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
  "/topics",
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
  "/moroccai/chat",
  "/morocco",
  "/apps",
  "/videos",
  "/github",
  "/prompts",
  "/scroller",
  "/saved",
  "/legal/affiliates",
  "/legal/privacy",
];

export const revalidate = 900;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  const regions = REGIONS.map((r) => ({
    url: `${base}/places/regions/${r.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const lists = LISTS.map((l) => ({
    url: `${base}/lists/${l.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
  const wikiArticles = listArticles().map((a) => ({
    url: `${base}/wiki/${a.slug}`,
    lastModified: a.timestamp ? new Date(a.timestamp) : now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));
  const topics = listTopics().map((a) => ({
    url: `${base}/topics/${a.slug}`,
    lastModified: a.timestamp ? new Date(a.timestamp) : now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));
  const videos = (await getSiteVideos()).map((v) => ({
    url: `${base}/videos/${v.id}`,
    lastModified: v.published_at ? new Date(v.published_at) : now,
    changeFrequency: "weekly" as const,
    priority: v.country === "Morocco" ? 0.7 : 0.5,
  }));
  return [...top, ...destinations, ...videos, ...regions, ...lists, ...wikiArticles, ...topics];
}
