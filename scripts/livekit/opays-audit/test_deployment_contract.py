"""Static safety contracts for the O'Pays voice deployment scripts."""

from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
VOICE_DIR = ROOT / "scripts" / "livekit"


class VoiceDeploymentContractTests(unittest.TestCase):
    def test_infrastructure_sources_contain_no_literal_credentials(self) -> None:
        paths = [
            VOICE_DIR / "deploy-turn.sh",
            VOICE_DIR / "deploy-voice-infra.sh",
            VOICE_DIR / "livekit.yaml",
        ]
        contents = {path: path.read_text(encoding="utf-8") for path in paths}

        for path, content in contents.items():
            with self.subTest(path=path.name):
                if re.search(r"TURN_SECRET=\"?\$\{TURN_SECRET:-[^}]+}", content):
                    self.fail(f"{path.name}: secret TURN de repli détecté")
                if re.search(
                    r"(?m)^\s{2,}[A-Za-z0-9_-]{8,}:\s*[^$\s][^\s]{15,}\s*$",
                    content,
                ):
                    self.fail(f"{path.name}: paire de clés LiveKit littérale détectée")

    def test_agent_deployment_is_prevalidated_and_fail_closed(self) -> None:
        content = (VOICE_DIR / "opays-audit" / "deploy-agent.sh").read_text(encoding="utf-8")
        required_markers = [
            '${TURN_SECRET:?',
            "SOURCE_SHA_FILE=",
            "git -C \"$REPO_DIR\" merge-base --is-ancestor",
            'worktree add --detach "$RELEASE_DIR" "$RELEASE_SHA"',
            "opays-audit-agent-candidate",
            "opays-token-server-candidate",
            "rollback()",
            'TOKEN_HTTP_CODE=',
            'test "$TOKEN_HTTP_CODE" = "200"',
            'http://127.0.0.1:8090/health',
            "-X POST",
            'VALIDATE_ONLY:-0',
            "hmac.compare_digest",
            "VOICE_E2E_COMMAND",
            'TOKEN_ENDPOINT="http://127.0.0.1:${CANDIDATE_TOKEN_PORT:-18090}/api/voice/token"',
            '--publish "127.0.0.1:${CANDIDATE_TOKEN_PORT:-18090}:8090"',
            "conversation.json",
            "REQUIRE_VOICE_E2E",
            "ALLOW_UNVERIFIED_SOURCE_TEST",
            'OLD_AGENT_IMAGE" ] || [ -z "$OLD_TOKEN_IMAGE',
            "restore_status=1",
        ]
        missing_markers = [marker for marker in required_markers if marker not in content]
        if missing_markers:
            self.fail(f"marqueurs de sécurité absents: {', '.join(missing_markers)}")

        first_candidate = content.index("opays-audit-agent-candidate")
        first_active_removal = content.index("docker rm -f opays-audit-agent ")
        self.assertLess(first_candidate, first_active_removal)

    def test_candidate_e2e_endpoint_is_isolated_and_test_flags_are_explicit(self) -> None:
        content = (VOICE_DIR / "opays-audit" / "deploy-agent.sh").read_text(encoding="utf-8")
        self.assertIn("TOKEN_REQUEST_ORIGIN=https://opays.io", content)
        self.assertIn('run_token_server opays-token-server-candidate "$TOKEN_IMAGE" no false', content)
        self.assertIn('VALIDATE_ONLY" != "1"', content)
        self.assertIn('ALLOW_UNVERIFIED_SOURCE_TEST:-0', content)
        self.assertIn("E2E_FIXTURE_DIR=${E2E_FIXTURE_DIR:-/opt/opays-voice/e2e-fixtures/", content)

    def test_livekit_deployment_is_candidate_validated_and_recoverable(self) -> None:
        content = (VOICE_DIR / "deploy-voice-infra.sh").read_text(encoding="utf-8")
        required_markers = [
            "opays-livekit-candidate",
            "opays-redis-candidate",
            "rollback()",
            'test "$LIVEKIT_HTTP_CODE" = "200"',
            'VALIDATE_ONLY:-0',
            "traefik.http.routers.opays-rtc.priority=80",
            'test "$(stat -c \'%a\' "$LIVEKIT_CONFIG_FILE")" = "600"',
        ]
        missing_markers = [marker for marker in required_markers if marker not in content]
        if missing_markers:
            self.fail(f"marqueurs LiveKit absents: {', '.join(missing_markers)}")

        first_candidate = content.index("opays-livekit-candidate")
        first_active_removal = content.index("docker rm -f opays-livekit opays-redis")
        self.assertLess(first_candidate, first_active_removal)

    def test_turn_deployment_uses_rest_auth_relay_ports_and_rollback(self) -> None:
        content = (VOICE_DIR / "deploy-turn.sh").read_text(encoding="utf-8")
        required_markers = [
            "use-auth-secret",
            'static-auth-secret=$TURN_SECRET',
            'opays.release=${RELEASE_SHA:-unknown}',
            'TURN_CONTAINER_NAME=${TURN_CONTAINER_NAME:-opays-turn}',
            'TURN_MIN_PORT=${TURN_MIN_PORT:-49160}',
            'TURN_MAX_PORT=${TURN_MAX_PORT:-49200}',
            "user-quota=4",
            "max-bps=200000",
            "bps-capacity=400000",
            "denied-peer-ip=10.0.0.0-10.255.255.255",
            "rollback()",
            'VALIDATE_ONLY:-0',
            'test "$(stat -c \'%a\' "$TURN_CONFIG_FILE")" = "600"',
        ]
        missing_markers = [marker for marker in required_markers if marker not in content]
        if missing_markers:
            self.fail(f"marqueurs TURN absents: {', '.join(missing_markers)}")

    def test_showcase_deployment_uses_exact_sha_candidate_and_rollback(self) -> None:
        content = (ROOT / "scripts" / "deploy-vps-opays-ai.sh").read_text(encoding="utf-8")
        required_markers = [
            '${RELEASE_SHA:?',
            'opays-ai:$RELEASE_SHA',
            "opays-ai-candidate",
            "rollback()",
            'test "$CONTACT_HTTP_CODE" = "200"',
            'worktree add --detach "$RELEASE_DIR" "$RELEASE_SHA"',
            "Contact — réservez votre Diagnostic gratuit",
        ]
        missing_markers = [marker for marker in required_markers if marker not in content]
        if missing_markers:
            self.fail(f"marqueurs de déploiement vitrine absents: {', '.join(missing_markers)}")

        first_candidate = content.index("opays-ai-candidate")
        first_active_removal = content.index("docker rm -f opays-ai ")
        self.assertLess(first_candidate, first_active_removal)

    def test_public_token_grants_are_microphone_only(self) -> None:
        content = (VOICE_DIR / "opays-audit" / "token_server.py").read_text(encoding="utf-8")
        self.assertIn('"canPublishSources": ["microphone"]', content)
        self.assertIn('"canPublishData": False', content)


if __name__ == "__main__":
    unittest.main()
