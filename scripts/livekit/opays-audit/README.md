# Agent vocal d’audit O’Pays

Sources runtime de l’agent **Amara** et du serveur de jetons LiveKit utilisé par le widget de `/contact/`.

## Architecture

- transport temps réel : LiveKit auto-hébergé ;
- STT : faster-whisper local ;
- TTS : Piper local ;
- LLM : OpenRouter ;
- serveur de jetons : JWT LiveKit et annonce TURN au navigateur.

Ollama ne fait pas partie de ce parcours.

## Secrets runtime

Aucune valeur secrète ne doit être ajoutée à ce répertoire, aux images Docker ou aux arguments de build. `deploy-agent.sh` charge exclusivement les fichiers protégés suivants sur le serveur :

- `/opt/opays-voice/openrouter.env` ;
- `/opt/opays-voice/livekit.env`.

Variables requises :

- `OPENROUTER_API_KEY` ;
- `LIVEKIT_API_KEY` ;
- `LIVEKIT_API_SECRET` ;
- `TURN_SECRET`.

Variables configurables : `OPENROUTER_MODEL`, `OPENROUTER_BASE_URL`, `LIVEKIT_WS_URL`, `TURN_HOST`, `TURN_PORT`, `TURN_CREDENTIAL_TTL_SECONDS`, `PIPER_VOICE_DIR`, `ALLOWED_ORIGINS` (liste séparée par des virgules), `RATE_LIMIT_REQUESTS`, `GLOBAL_RATE_LIMIT_REQUESTS` et `RATE_LIMIT_WINDOW_SECONDS`.

Les credentials TURN sont temporaires et signés HMAC depuis `TURN_SECRET`. Aucun compte TURN statique (`TURN_USER`) n’est utilisé. Le serveur de jetons refuse toute requête sans origine autorisée, génère lui-même la salle et l’identité et applique deux plafonds de débit : par client et global.

## Déploiement

Le déploiement se fait depuis un SHA Git complet de 40 caractères :

1. lancer `VALIDATE_ONLY=1 RELEASE_SHA=<sha> ./deploy-agent.sh` : le script clone le dépôt officiel, vérifie l’ancêtre `origin/main` et crée lui-même un worktree détaché ;
2. fournir `VOICE_E2E_COMMAND` pour l’essai Playwright RTC/TURN avec la fixture attestée ;
3. lancer ensuite `RELEASE_SHA=<sha> VOICE_E2E_COMMAND='...' ./deploy-agent.sh`.

Le premier passage construit et exerce les candidats sans toucher aux conteneurs actifs. Le second ne remplace `opays-audit-agent` et `opays-token-server` qu’après validation, puis restaure leurs images précédentes si une vérification interne ou publique échoue.

Pour une rotation des credentials LiveKit/TURN :

1. valider `deploy-voice-infra.sh` avec un fichier d’environnement `600` candidat ;
2. lancer un nouveau coturn REST sur un nom, un port et une plage relay distincts ;
3. déployer l’agent/token server configuré vers ce nouveau port ;
4. vérifier un appel avec `FORCE_TURN_RELAY=1` ;
5. retirer l’ancien coturn uniquement après cette preuve.

## Vérifications

```bash
python -m py_compile agent.py adapters_locaux.py token_server.py test_piper_runtime.py generate_speech_fixture.py validate_speech_fixture.py
bash -n deploy-agent.sh
npm run test:voice
```

Après construction de l’image agent :

```bash
python test_piper_runtime.py
```

La validation complète exige ensuite : token HTTP 200, connexion LiveKit, publication microphone, piste distante `live`, salutation audible et réponse post-STT dans un navigateur réel.

## Fixture conversationnelle Piper

Le WAV est temporaire et ne doit jamais être commité. Depuis l’image agent :

```bash
python generate_speech_fixture.py --output /tmp/opays-speech-fixture.wav --metadata /tmp/opays-speech-fixture.json
python validate_speech_fixture.py /tmp/opays-speech-fixture.wav --metadata /tmp/opays-speech-fixture.json
```

Le manifeste JSON est complété par faster-whisper et contient le SHA-256, les bornes audio et l’attestation `validated=true`. Le harnais vérifie ce manifeste :

```bash
FULL_CONVERSATION=1 \
FAKE_AUDIO_FILE=/chemin/temporaire/opays-speech-fixture.wav \
FAKE_AUDIO_METADATA=/chemin/temporaire/opays-speech-fixture.json \
PERMISSIVE_AUTOPLAY=1 \
node scripts/test-voice-browser.mjs
```

L’oracle exige une salutation avant l’entrée vocale **et** une nouvelle salve distante après sa fin. `FORCE_TURN_RELAY=1` force en plus Chromium à établir le média uniquement via coturn.
