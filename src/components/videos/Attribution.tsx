import type { ReactNode } from "react";

const TOKEN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;

/** Linkify markdown links and bare URLs inside one line of attribution text. */
function linkify(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(line.slice(last, i));
    const href = m[2] ?? m[3];
    out.push(
      <a key={i} href={href} target="_blank" rel="noopener noreferrer nofollow">
        {m[1] ?? href}
      </a>,
    );
    last = i + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

const FALLBACK =
  "Narration adapted from Wikivoyage (https://en.wikivoyage.org), CC BY-SA 4.0.\nPhotos: Wikimedia Commons contributors (https://commons.wikimedia.org), under CC BY-SA, CC BY or CC0 licences.";

/**
 * Required CC BY-SA credits, rendered from detail.attribution (markdown-ish:
 * plain lines, "- " list items, bare or [text](url) links). Hashtag-only lines
 * (YouTube description leftovers) are dropped.
 */
export function Attribution({ text }: { text: string | null }) {
  const lines = (text && text.trim() ? text : FALLBACK)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^(#\w+\s*)+$/.test(l));

  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {list.map((l, i) => (
            <li key={i}>{linkify(l)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const l of lines) {
    if (/^[-*]\s+/.test(l)) list.push(l.replace(/^[-*]\s+/, ""));
    else {
      flush();
      blocks.push(<p key={`p-${blocks.length}`}>{linkify(l)}</p>);
    }
  }
  flush();

  return (
    <section className="tv-block tv-attrib" id="attribution" aria-label="Attribution">
      <h2>Credits &amp; licences</h2>
      {blocks}
    </section>
  );
}
