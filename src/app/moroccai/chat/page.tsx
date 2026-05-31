import { Suspense } from "react";
import { ChatClient } from "./ChatClient";

export const metadata = {
  title: "MoroccAI — chat",
  description: "Ask anything about Morocco. MoroccAI grounds answers in the MTD catalogue.",
};

type Search = { dest?: string; region?: string; topic?: string };

export default async function MoroccaiChatPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { dest, region, topic } = await searchParams;
  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading chat…</div>}>
      <ChatClient dest={dest} region={region} topic={topic} />
    </Suspense>
  );
}
