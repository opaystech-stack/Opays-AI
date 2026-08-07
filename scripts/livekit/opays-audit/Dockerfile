# Agent d'Audit Vocal Opays — STT/TTS locaux, LLM via OpenRouter
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Outils système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ python3-dev libglib2.0-0 wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dépendances Python (framework + plugins locaux + piper-tts)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Voix piper française (siwis-medium) — modèles .onnx + .onnx.json
RUN mkdir -p /voices && cd /voices \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json \
    && ls -la /voices

# Code de l'agent
COPY agent.py adapters_locaux.py ./

# Les identifiants LiveKit/OpenRouter sont injectés au runtime via des fichiers
# d'environnement protégés. Aucun secret ne doit être embarqué dans l'image.
ENV OPENROUTER_BASE_URL=https://openrouter.ai/api/v1 \
    OPENROUTER_MODEL=openai/gpt-4o-mini \
    PIPER_VOICE_DIR=/voices

CMD ["python", "-u", "agent.py"]
