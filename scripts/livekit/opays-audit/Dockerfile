# Agent d'Audit Vocal Opays — STT/TTS locaux, LLM via OpenRouter
FROM python:3.11-slim@sha256:90744cff8f32887f075c47d747a173ff333e9e98801667af93c357fa9f5e28ff

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/models/huggingface

# Outils système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ python3-dev libglib2.0-0 wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dépendances Python (framework + plugins locaux + piper-tts)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Précharger le même modèle que l'adapter runtime pour éviter tout téléchargement
# réseau lors de la première conversation et rendre la validation reproductible.
RUN mkdir -p "$HF_HOME" \
    && python -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"

# Voix piper française (siwis-medium) — modèles .onnx + .onnx.json
RUN mkdir -p /voices && cd /voices \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json \
    && printf '%s  %s\n%s  %s\n' \
      '641d1ab097da2b81128c076810edb052b385decc8be3381814802a64a73baf99' 'fr_FR-siwis-medium.onnx' \
      '39479916c2db192b5ac9764daddd0c744d83e023ad890c6976c0633ae4df8959' 'fr_FR-siwis-medium.onnx.json' \
      | sha256sum -c - \
    && ls -la /voices

# Code de l'agent et générateur de fixture E2E temporaire
COPY agent.py adapters_locaux.py generate_speech_fixture.py validate_speech_fixture.py ./

# Les identifiants LiveKit/OpenRouter sont injectés au runtime via des fichiers
# d'environnement protégés. Aucun secret ne doit être embarqué dans l'image.
ENV OPENROUTER_BASE_URL=https://openrouter.ai/api/v1 \
    OPENROUTER_MODEL=openai/gpt-4o-mini \
    PIPER_VOICE_DIR=/voices

RUN chown -R 10001:10001 /app /voices /models
USER 10001:10001

CMD ["python", "-u", "agent.py"]
