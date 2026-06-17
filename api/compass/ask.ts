import { searchCompass } from "../../scripts/compass-memory.mjs";

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function readQuery(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  if (q) return q;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null);
    const query = body && typeof body === "object" ? (body as { query?: string }).query : "";
    return typeof query === "string" ? query.trim() : "";
  }

  return "";
}

export default async function handler(request: Request) {
  if (request.method !== "GET" && request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const query = await readQuery(request);
  if (!query) {
    return json({ error: "Missing query", hint: "Use ?q=... or POST { query }" }, 400);
  }

  try {
    const result = await searchCompass(query);
    return json(result);
  } catch (error) {
    return json(
      {
        error: "Compass search failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
}

export const config = {
  // Runtime Node.js car la recherche lit des fichiers Markdown locaux (node:fs).
  runtime: "nodejs",
};
