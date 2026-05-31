import type { ReactNode } from "react";

type Stat = { label: string; value: string | number };

type Props = {
  crumb: string;
  title: string;
  tagline?: string;
  stats?: Stat[];
  children?: ReactNode;
};

export function PageHeader({ crumb, title, tagline, stats, children }: Props) {
  return (
    <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--app-accent)" }}
        />
        MTD · {crumb}
      </div>
      <h1 className="mt-3 text-4xl font-bold text-zinc-100">{title}</h1>
      {tagline && <p className="mt-2 max-w-3xl text-zinc-400">{tagline}</p>}
      {stats && stats.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
          {stats.map((s) => (
            <span key={s.label}>
              <b className="text-zinc-100">{s.value}</b>
              <span className="ml-1.5 text-xs uppercase tracking-wider text-zinc-500">{s.label}</span>
            </span>
          ))}
        </div>
      )}
      {children}
    </header>
  );
}
