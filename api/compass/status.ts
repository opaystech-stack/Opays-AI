import { getCompassMetrics } from "../../scripts/compass-memory.mjs";

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export default async function handler(_request: Request) {
  try {
    const metrics = await getCompassMetrics();
    return json(metrics);
  } catch (error) {
    return json(
      {
        error: "Compass metrics failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
}

export const config = {
  runtime: "nodejs",
};
