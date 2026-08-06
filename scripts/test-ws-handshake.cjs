// Test du handshake WebSocket vers LiveKit via Traefik (sans WebRTC)
// Valide : token server → jeton valide, route /rtc → LiveKit, handshake 101.
const TOKEN_URL = "https://opays.io/api/voice/token";
const WS_URL = "wss://opays.io/rtc";

async function main() {
  console.log("[1/2] Jeton…");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`token HTTP ${res.status}`);
  const { token, url } = await res.json();
  console.log(`[1/2] OK — url: ${url}`);

  console.log("[2/2] Handshake WebSocket…");
  const ws = new WebSocket(`${WS_URL}?access_token=${token}`);
  const timeout = setTimeout(() => {
    console.error("TIMEOUT — pas de réponse WS");
    process.exit(1);
  }, 15000);

  ws.onopen = () => {
    console.log("[2/2] ✅ Handshake WS réussi (101) — LiveKit joignable via Traefik");
    clearTimeout(timeout);
    ws.close();
    process.exit(0);
  };
  ws.onerror = (e) => {
    console.error("❌ Erreur WS:", e.message || e);
    clearTimeout(timeout);
    process.exit(1);
  };
}

main().catch((e) => {
  console.error("ÉCHEC:", e.message);
  process.exit(1);
});
