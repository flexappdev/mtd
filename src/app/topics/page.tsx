import Link from "next/link";
import { PageHeader } from "@/components/v2/PageHeader";
import { listItems, listKinds, stats } from "@/lib/wikipedia-morocco";

export const revalidate = 300;

export const metadata = {
  title: "Topics — the Morocco directory",
  description: "Browse everything Morocco — cities, kasbahs, mosques, mountains, rivers, food, culture, history. Grouped by kind, sourced from Wikipedia.",
};

const KIND_LABELS: Record<string, string> = {
  city: "Cities", town: "Towns", village: "Villages", place: "Places",
  kasbah: "Kasbahs", mosque: "Mosques", medina: "Medinas", madrasa: "Madrasas",
  beach: "Beaches", river: "Rivers", mountain: "Mountains", "mountain-pass": "Mountain passes",
  valley: "Valleys", desert: "Deserts", unesco: "UNESCO sites",
  "national-park": "National parks", "protected-area": "Protected areas",
  museum: "Museums", palace: "Palaces", gate: "Gates", square: "Squares", garden: "Gardens",
  food: "Cuisine", dish: "Dishes", culture: "Berber culture",
  festival: "Festivals", history: "History", dynasty: "Dynasties",
  building: "Buildings", attraction: "Attractions", landform: "Landforms",
  waterfall: "Waterfalls", island: "Islands", roman: "Roman sites",
  archaeological: "Archaeological", province: "Provinces", region: "Regions",
  marrakech: "Marrakech", fes: "Fes", casablanca: "Casablanca", rabat: "Rabat",
  tangier: "Tangier", meknes: "Meknes", essaouira: "Essaouira",
  chefchaouen: "Chefchaouen", agadir: "Agadir", ouarzazate: "Ouarzazate",
  "sahrawi-culture": "Sahrawi culture", music: "Music", sport: "Sport",
};

export default function TopicsIndexPage() {
  const s = stats();
  const kinds = listKinds();
  const items = listItems();

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Topics"
        title="The Morocco directory"
        tagline="Every named place, cuisine, festival, and culture in Morocco — sourced from Wikipedia, cross-linked to MoroccAI."
        stats={[
          { label: "Items", value: s.total },
          { label: "Kinds", value: s.kinds },
          { label: "With photo", value: s.withThumbnail },
          { label: "Mapped", value: s.withCoords },
        ]}
      />

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Browse by kind
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {kinds.map((k) => (
            <a
              key={k.kind}
              href={`#kind-${k.kind}`}
              className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-600"
            >
              <span>{KIND_LABELS[k.kind] ?? k.kind}</span>
              <span className="text-xs text-zinc-500">{k.count}</span>
            </a>
          ))}
        </div>
      </section>

      {kinds.map((k) => {
        const inKind = items.filter((i) => i.kind === k.kind).slice(0, 24);
        return (
          <section key={k.kind} id={`kind-${k.kind}`} className="scroll-mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                {KIND_LABELS[k.kind] ?? k.kind}
              </h2>
              <span className="text-xs text-zinc-500">{k.count} items</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {inKind.map((a) => (
                <Link
                  key={a.slug}
                  href={`/topics/${a.slug}`}
                  className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 hover:border-zinc-600"
                >
                  {a.thumbnail ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={a.thumbnail}
                      alt={a.title}
                      className="h-16 w-24 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-24 shrink-0 place-items-center rounded bg-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                      {k.kind.slice(0, 3)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">
                      {a.title}
                    </h3>
                    {a.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{a.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {k.count > 24 && (
              <p className="mt-3 text-xs text-zinc-600">
                Showing 24 of {k.count} · scroll or use MoroccAI to explore the rest.
              </p>
            )}
          </section>
        );
      })}

      <p className="border-t border-zinc-800 pt-4 text-xs text-zinc-600">
        Content from Wikipedia · licensed{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/3.0/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          CC BY-SA 3.0
        </a>
        . Universe last built {new Date(s.crawledAt).toISOString().slice(0, 10)}.
      </p>
    </div>
  );
}
