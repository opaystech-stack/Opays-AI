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

Variables configurables : `OPENROUTER_MODEL`, `OPENROUTER_BASE_URL`, `LIVEKIT_WS_URL`, `TURN_HOST`, `TURN_USER`, `PIPER_VOICE_DIR` et `ALLOWED_ORIGINS` (liste séparée par des virgules).

## Déploiement

Synchroniser ce répertoire vers `/opt/opays-voice/agent-src`, puis exécuter `deploy-agent.sh` sur le serveur. Le script recrée uniquement `opays-audit-agent` et `opays-token-server` sur le réseau isolé `opays-voice-net`.

## Vérifications

```bash
python -m py_compile agent.py adapters_locaux.py token_server.py test_piper_runtime.py
bash -n deploy-agent.sh
```

Après construction de l’image agent :

```bash
python test_piper_runtime.py
```

La validation complète exige ensuite : token HTTP 200, connexion LiveKit, publication microphone, piste distante `live`, salutation audible et réponse post-STT dans un navigateur réel.
