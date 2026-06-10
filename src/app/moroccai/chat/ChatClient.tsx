"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackMoroccaiMessage } from "@/lib/analytics";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  dest?: string;
  region?: string;
  topic?: string;
};

const SEED: Record<string, string> = {
  "trip-plan": "Plan me a 7-day Morocco itinerary starting in Marrakech, ending in Fes — comfortable hotels, one desert night, one mountain night.",
  "where-eat": "Where should I eat in Marrakech for the first night — mid-budget, walking distance from Jemaa el-Fna?",
  "what-pack": "What should I pack for a week in October — Marrakech, Atlas, and one night in the Sahara?",
  "phrases": "Give me a short list of Darija phrases I'll actually use — greetings, bargaining, ordering food.",
  "transit": "How do I get from Casablanca to Fes by train — best class, cost, journey time, station names?",
  "ramadan": "Travelling during Ramadan — what changes on the ground for tourists in Marrakech?",
};

export function ChatClient({ dest, region, topic }: Props) {
  const seed = topic && SEED[topic] ? SEED[topic] : "";
  const [input, setInput] = useState(seed);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);

  const ctxLabel = useMemo(() => {
    const parts: string[] = [];
    if (dest) parts.push(`dest=${dest}`);
    if (region) parts.push(`region=${region}`);
    if (topic) parts.push(`topic=${topic}`);
    return parts.join(" · ");
  }, [dest, region, topic]);

  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setError(null);
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setStreaming(true);
    trackMoroccaiMessage({ dest, region, topic });
    // optimistic assistant placeholder
    setMsgs((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/moroccai/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, dest, region, topic }),
      });
      if (!res.ok || !res.body) {
        const errBody = await res.text().catch(() => "");
        throw new Error(errBody || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: buffer };
          return copy;
        });
      }
    } catch (e) {
      setError((e as Error).message || "Stream error");
      setMsgs((m) => {
        const copy = [...m];
        if (copy.length > 0 && copy[copy.length - 1].role === "assistant" && copy[copy.length - 1].content === "") {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }, [dest, region, topic, input, msgs, streaming]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-8" style={{ minHeight: "calc(100vh - 220px)" }}>
      <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-red-950/30 to-zinc-950 p-6">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#c1272d" }} />
          MoroccAI · chat
        </div>
        <h1 className="mt-2 text-3xl font-bold text-zinc-100">✦ MoroccAI</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ask anything about Morocco. Grounded in the MTD catalogue (destinations, hotels, sights, food, lists).
          {ctxLabel && <span className="ml-2 rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-300">{ctxLabel}</span>}
        </p>
      </header>

      <div className="flex-1 space-y-3">
        {msgs.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-sm text-zinc-500">
            Ask a question to get started. Try “Plan 10 days in Morocco from Marrakech” or “Best riad in Fes under €150”.
          </div>
        )}
        {msgs.map((m, i) => (
          <article
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100"
                : "max-w-[85%] rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200"
            }
          >
            <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">
              {m.role === "user" ? "you" : "moroccai"}
            </div>
            <div className="whitespace-pre-wrap leading-relaxed">{m.content || (streaming && i === msgs.length - 1 ? "…" : "")}</div>
          </article>
        ))}
        {error && (
          <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-xs text-red-300">{error}</div>
        )}
        <div ref={tailRef} />
      </div>

      <form
        className="sticky bottom-4 flex items-end gap-2 rounded-lg border border-zinc-700 bg-zinc-950 p-2 shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask MoroccAI… (Cmd+Enter to send)"
          rows={2}
          disabled={streaming}
          className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={streaming || input.trim().length === 0}
          className="rounded bg-red-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40 hover:bg-red-600"
        >
          {streaming ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
