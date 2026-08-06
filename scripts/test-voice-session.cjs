// Test bout-en-bout de la session vocale d'audit — reproduit le flux du widget React.
// 1. POST /api/voice/token (token server via Traefik)
// 2. room.connect('wss://opays.io/rtc', token) — comme le fera le navigateur
// 3. Vérifie que l'agent rejoint la salle
const { Room, RoomEvent } = require("livekit-client");

async function main() {
  console.log("[1/3] Récupération du jeton…");
  const res = await fetch("https://opays.io/api/voice/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`token HTTP ${res.status}`);
  const { token, url, room } = await res.json();
  console.log(`[1/3] OK — room: ${room}, url: ${url}`);

  console.log("[2/3] Connexion WebRTC…");
  const r = new Room();
  r.on(RoomEvent.ParticipantConnected, (p) => {
    console.log(`[3/3] Participant rejoint: ${p.identity} (${p.kind})`);
  });
  r.on(RoomEvent.TrackSubscribed, (track) => {
    console.log(`[3/3] Track audio reçue: ${track.kind} — L'AGENT PARLE`);
  });
  r.on(RoomEvent.Disconnected, () => console.log("Déconnecté"));
  r.on(RoomEvent.ConnectionStateChanged, (s) => console.log(`État: ${s}`));

  await r.connect(url, token);
  console.log("[2/3] Connecté à la salle");

  // Attendre que l'agent rejoigne et parle (max 30s)
  await new Promise((resolve) => setTimeout(resolve, 30000));
  console.log("Test terminé — participants:", r.remoteParticipants.size);
  await r.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("ÉCHEC:", e.message);
  process.exit(1);
});
