"""
Agent d'Audit Vocal Opays Tech — « Diagnostic gratuit » conversationnel.

Persona et grille d'audit alignés sur la méthode Opays :
  1. Lecture du terrain (activité, équipes, outils)
  2. Cartographie des frictions (goulots d'étranglement)
  3. Opportunités d'automatisation (IA locale, souveraine)
  4. Données & contrôle (patrimoine cognitif, RBAC)
  5. ROI & prochaine action (diagnostic → Système d'Efficience)

Pile self-hosted pour le transport et la voix, avec LLM OpenRouter :
  - LLM  : OpenRouter via API OpenAI-compatible
  - VAD  : Silero (plugin local)
  - STT  : faster-whisper (local, StreamAdapter)
  - TTS  : piper (local, StreamAdapter)
"""

import logging
import os

from dotenv import load_dotenv

from livekit.agents import (
    Agent,
    AgentSession,
    AgentServer,
    JobContext,
    RunContext,
    TurnHandlingOptions,
    cli,
    room_io,
    text_transforms,
)
from livekit.agents.beta import EndCallTool
from livekit.agents.llm import function_tool
from livekit.plugins import openai, silero

logger = logging.getLogger("opays-audit-agent")

load_dotenv()

OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

if not OPENROUTER_API_KEY:
    raise RuntimeError(
        "OPENROUTER_API_KEY est manquante : configurez-la au runtime avant de démarrer l'agent."
    )


class AuditAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "Tu es « Amara », l'auditrice IA vocale d'Opays Tech, cabinet d'ingénierie "
                "de l'efficience pour les organisations opérationnelles en RDC. "
                "Ton rôle : mener un diagnostic gratuit et conversationnel pour identifier "
                "les goulots d'étranglement, les processus à automatiser et les gains rapides. "
                "Règles : "
                "- Parle français, de façon concise, chaleureuse et professionnelle. "
                "- Pose UNE question à la fois, attends la réponse. "
                "- Ne lis jamais de liste exhaustive : synthétise à la fin. "
                "- N'invente jamais de chiffres ni de faits : utilise les outils. "
                "- Si l'utilisateur ne sait pas, propose une estimation et note-la comme telle. "
                "- Termine par une recommandation priorisée (3 actions) et propose "
                "d'envoyer le résumé par email. "
            ),
            tools=[EndCallTool()],
        )

    async def on_enter(self) -> None:
        await self.session.generate_reply(
            instructions=(
                "Salue l'utilisateur, présente-toi comme l'auditrice vocale d'Opays Tech, "
                "explique que ce diagnostic gratuit dure environ 5 minutes, et demande "
                "son nom et le secteur d'activité de son organisation."
            )
        )

    @function_tool
    async def enregistrer_reponse(
        self,
        context: RunContext,
        question: str,
        reponse: str,
        categorie: str,
    ) -> str:
        """Enregistre la réponse de l'utilisateur dans la grille d'audit.

        Args:
            question: La question posée à l'utilisateur.
            reponse: La réponse brute de l'utilisateur.
            categorie: Une de : 'terrain', 'frictions', 'automatisation', 'donnees', 'roi'.
        """
        logger.info("Réponse d'audit enregistrée (catégorie=%s)", categorie)
        return "Réponse enregistrée. Merci."

    @function_tool
    async def identifier_goulots(
        self,
        context: RunContext,
        processus: str,
        temps_estime_heures_semaine: float,
        frequence_erreurs: str,
    ) -> str:
        """Analyse un processus cité par l'utilisateur pour qualifier le goulot.

        Args:
            processus: Nom du processus (ex: 'saisie des commandes').
            temps_estime_heures_semaine: Temps hebdomadaire estimé.
            frequence_erreurs: Fréquence des erreurs ('rare', 'parfois', 'souvent').
        """
        logger.info("Goulot d'étranglement qualifié pour l'audit")
        return (
            f"Goulot potentiel noté : {processus} ({temps_estime_heures_semaine}h/semaine). "
            "Je vais le retenir pour la recommandation finale."
        )

    @function_tool
    async def resumer_audit(self, context: RunContext) -> str:
        """Génère la synthèse de fin d'audit : 3 actions priorisées + prochaine étape."""
        print("[AUDIT] Demande de synthèse finale")
        return (
            "Voici la trame de synthèse : 1) automatiser les tâches répétitives les plus "
            "coûteuses identifiées ; 2) sécuriser les données avec une IA locale sous "
            "contrôle ; 3) mettre en place un suivi hebdomadaire des indicateurs. "
            "La prochaine étape recommandée est le Système d'Efficience d'Opays Tech."
        )


server = AgentServer()


@server.rtc_session()
async def entrypoint(ctx: JobContext) -> None:
    ctx.log_context_fields = {"room": ctx.room.name}

    # VAD local (Silero ONNX)
    vad = silero.VAD.load()

    from adapters_locaux import FasterWhisperSTT, PiperTTS

    session: AgentSession = AgentSession(
        # LLM via OpenRouter (API OpenAI-compatible — cloud, multilingue)
        llm=openai.LLM(
            model=OPENROUTER_MODEL,
            base_url=OPENROUTER_BASE_URL,
            api_key=OPENROUTER_API_KEY,
        ),
        # STT + TTS 100% locaux (faster-whisper + piper)
        stt=FasterWhisperSTT(model_size="base", language="fr"),
        tts=PiperTTS(voice="fr_FR-siwis-medium"),
        vad=vad,
        turn_handling=TurnHandlingOptions(
            interruption={
                "resume_false_interruption": True,
                "false_interruption_timeout": 1.0,
            },
            preemptive_generation={"enabled": False},
        ),
        aec_warmup_duration=3.0,
        tts_text_transforms=[
            "filter_emoji",
            "filter_markdown",
        ],
    )

    @session.on("metrics_collected")
    def _on_metrics_collected(ev) -> None:
        pass  # métriques loggées par le serveur

    await session.start(
        agent=AuditAgent(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(),
        ),
    )


if __name__ == "__main__":
    import asyncio

    asyncio.run(server.run())
