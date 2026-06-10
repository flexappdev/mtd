import { FrontHomeV2 } from "@/components/v2/FrontHomeV2";
import { DESTINATIONS } from "@/lib/mtd-v2/seed";
import { tryGetDb } from "@/lib/mongo";
import type { Destination } from "@/lib/mtd-v2/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moroccotopdestinations.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Morocco Top Destinations",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Morocco Top Destinations",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/places?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const revalidate = 300;

async function loadDestinations(): Promise<Destination[]> {
  const db = await tryGetDb();
  if (!db) return DESTINATIONS;
  try {
    const rows = await db
      .collection<Destination>("mtd_destinations")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    if (rows.length > 0) return rows;
  } catch (err) {
    console.warn("[mtd/page] mongo read failed, using seed:", (err as Error).message);
  }
  return DESTINATIONS;
}

export default async function HomePage() {
  const destinations = await loadDestinations();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FrontHomeV2 destinations={destinations} />
    </>
  );
}
