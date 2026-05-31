import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { MOROCCAI_BASE_PROMPT, MOROCCAI_MODEL, contextHint } from "@/lib/moroccai/system-prompt";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Body = {
  messages: ChatMessage[];
  dest?: string;
  region?: string;
  topic?: string;
};

const MAX_TOKENS = 1024;

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not set on this deployment" }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const sanitized = messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-20)
    .map((m) => ({ role: m.role === "assistant" ? ("assistant" as const) : ("user" as const), content: m.content.slice(0, 4000) }));

  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== "user") {
    return new Response(JSON.stringify({ error: "last message must be user" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const hint = contextHint(body.dest, body.region, body.topic);

  const client = new Anthropic({ apiKey: key });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const upstream = client.messages.stream({
          model: MOROCCAI_MODEL,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: "text",
              text: MOROCCAI_BASE_PROMPT,
              cache_control: { type: "ephemeral" },
            },
            ...(hint
              ? [{ type: "text" as const, text: hint }]
              : []),
          ],
          messages: sanitized,
        });

        for await (const event of upstream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const msg = (err as Error).message || "stream error";
        controller.enqueue(encoder.encode(`\n\n[error: ${msg}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}

export function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      route: "/api/moroccai/stream",
      method: "POST",
      schema: {
        messages: "ChatMessage[]",
        dest: "string?",
        region: "string?",
        topic: "string?",
      },
      model: MOROCCAI_MODEL,
    }),
    { headers: { "content-type": "application/json" } },
  );
}
