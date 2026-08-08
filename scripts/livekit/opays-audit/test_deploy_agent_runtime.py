"""Reproducible failure-path tests for deploy-agent.sh using a fake Docker CLI."""

from __future__ import annotations

import os
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DEPLOY_SCRIPT = ROOT / "deploy-agent.sh"
RELEASE_SHA = "a" * 40
GIT_BASH = Path("C:/Program Files/Git/bin/bash.exe")


def msys_path(path: Path) -> str:
    resolved = path.resolve()
    drive = resolved.drive.rstrip(":").lower()
    remainder = resolved.as_posix().split(":", 1)[1].lstrip("/")
    return f"/{drive}/{remainder}"

FAKE_DOCKER = r"""#!/bin/bash
set -eu
printf '%s\n' "$*" >> "$FAKE_DOCKER_LOG"
command_name=${1:-}
shift || true
case "$command_name" in
  inspect)
    container=${1:-}
    arguments="$*"
    if [[ "$arguments" == *".Image"* ]]; then
      case "$container" in
        opays-audit-agent) echo "sha256:old-agent" ;;
        opays-token-server) echo "sha256:old-token" ;;
        *) echo "sha256:unknown" ;;
      esac
    elif [[ "$arguments" == *"RestartCount"* ]]; then
      echo "0"
    elif [[ "$container" == "opays-livekit" ]]; then
      echo "172.16.6.3"
    else
      echo "true"
    fi
    ;;
  logs)
    container=${1:-}
    if [ "${FAIL_CANDIDATE_AGENT:-0}" = "1" ] && [ "$container" = "opays-audit-agent-candidate" ]; then
      exit 0
    fi
    if [ "${FAIL_FINAL_AGENT:-0}" = "1" ] && [ "$container" = "opays-audit-agent" ]; then
      exit 0
    fi
    if [[ "$container" == opays-audit-agent* ]]; then
      echo "worker registered"
    fi
    ;;
  exec)
    cat >/dev/null
    ;;
  build)
    echo "fake build complete"
    ;;
  run)
    arguments="$*"
    if [[ "$arguments" == *"generate_speech_fixture.py"* ]]; then
      fixture_mount=$(printf '%s\n' "$arguments" | tr ' ' '\n' | grep -m1 '^/tmp/.*:/fixtures$' || true)
      fixture_dir=${fixture_mount%%:/fixtures}
      mkdir -p "$fixture_dir"
      touch "$fixture_dir/conversation.wav" "$fixture_dir/conversation.json"
    fi
    echo "fake-container-id"
    ;;
  network)
    subcommand=${1:-}
    if [ "$subcommand" = "inspect" ]; then
      format="$*"
      case "$format" in
        *".Driver"*) echo "bridge" ;;
        *"opays.isolated"*) echo "true" ;;
        *".Containers"*) ;;
      esac
    fi
    ;;
  rm|tag|ps)
    ;;
  *)
    echo "unexpected fake docker command: $command_name" >&2
    exit 2
    ;;
esac
"""


class DeployAgentRuntimeTests(unittest.TestCase):
    def run_deploy(self, **scenario: str) -> tuple[subprocess.CompletedProcess[str], list[str]]:
        with tempfile.TemporaryDirectory(prefix="opays-deploy-test-") as directory:
            root = Path(directory)
            fake_bin = root / "bin"
            source = root / "source"
            fake_bin.mkdir()
            source.mkdir()
            e2e_fixture_dir = root / "e2e-fixtures"
            e2e_fixture_dir.mkdir()
            docker = fake_bin / "docker"
            docker.write_text(FAKE_DOCKER, encoding="utf-8", newline="\n")
            (fake_bin / "sleep").write_text("#!/bin/bash\nexit 0\n", encoding="utf-8")
            (fake_bin / "stat").write_text("#!/bin/bash\necho 600\n", encoding="utf-8")
            for executable in (docker, fake_bin / "sleep", fake_bin / "stat"):
                executable.chmod(0o755)

            openrouter_env = root / "openrouter.env"
            openrouter_env.write_text("OPENROUTER_API_KEY=test-openrouter-key\n", encoding="utf-8")
            openrouter_env.chmod(0o600)
            livekit_env = root / "livekit.env"
            livekit_env.write_text(
                "\n".join(
                    [
                        "LIVEKIT_API_KEY=test-livekit-key",
                        f"LIVEKIT_API_SECRET={'s' * 40}",
                        f"TURN_SECRET={'t' * 40}",
                        "TURN_HOST=127.0.0.1",
                    ]
                )
                + "\n",
                encoding="utf-8",
            )
            livekit_env.chmod(0o600)
            (source / ".release-sha").write_text(RELEASE_SHA + "\n", encoding="utf-8")
            log_file = root / "docker.log"
            e2e_endpoint_log = root / "e2e-endpoint.log"

            environment = os.environ.copy()
            environment.update(
                {
                    "FAKE_BIN": msys_path(fake_bin),
                    "FAKE_DOCKER_LOG": msys_path(log_file),
                    "OPENROUTER_ENV_FILE": msys_path(openrouter_env),
                    "LIVEKIT_ENV_FILE": msys_path(livekit_env),
                    "E2E_FIXTURE_DIR": msys_path(e2e_fixture_dir),
                    "SRC": msys_path(source),
                    "ALLOW_UNVERIFIED_SOURCE_TEST": "1",
                    "VALIDATE_ONLY": "0" if scenario.get("FAIL_FINAL_AGENT") == "1" else "1",
                    "DEPLOY_SCRIPT_PATH": msys_path(DEPLOY_SCRIPT),
                    "RELEASE_SHA": RELEASE_SHA,
                    "REQUIRE_VOICE_E2E": "1" if scenario.get("FAIL_FINAL_AGENT") == "1" or scenario.get("VERIFY_E2E_ENDPOINT") == "1" else "0",
                    "E2E_ENDPOINT_LOG": msys_path(e2e_endpoint_log),
                    "VOICE_E2E_COMMAND": 'printf "%s" "$TOKEN_ENDPOINT" > "$E2E_ENDPOINT_LOG"' if scenario.get("VERIFY_E2E_ENDPOINT") == "1" else "true",
                    **scenario,
                }
            )
            result = subprocess.run(
                [
                    str(GIT_BASH),
                    "-c",
                    'export PATH="$FAKE_BIN:/usr/bin:/bin"; exec "$DEPLOY_SCRIPT_PATH"',
                ],
                cwd=source,
                env=environment,
                capture_output=True,
                text=True,
                timeout=20,
                check=False,
            )
            if not log_file.exists():
                if scenario.get("EXPECT_EARLY_REJECT") == "1":
                    return result, []
                self.fail(
                    "fake Docker was not invoked\n"
                    f"stdout:\n{result.stdout}\n"
                    f"stderr:\n{result.stderr}"
                )
            calls = log_file.read_text(encoding="utf-8").splitlines()
            if scenario.get("VERIFY_E2E_ENDPOINT") == "1":
                self.assertEqual(
                    e2e_endpoint_log.read_text(encoding="utf-8"),
                    "http://127.0.0.1:18090/api/voice/token",
                )
            return result, calls

    def test_candidate_failure_never_removes_active_containers(self) -> None:
        result, calls = self.run_deploy(FAIL_CANDIDATE_AGENT="1")

        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(any("opays-audit-agent-candidate" in call for call in calls))
        self.assertFalse(any(re.fullmatch(r"rm -f opays-audit-agent opays-token-server.*", call) for call in calls))

    def test_arbitrary_source_is_rejected_for_promotion(self) -> None:
        result, calls = self.run_deploy(FAIL_FINAL_AGENT="1", EXPECT_EARLY_REJECT="1")

        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [])
        self.assertIn("SRC est interdit", result.stderr)

    def test_e2e_command_receives_candidate_token_endpoint(self) -> None:
        result, _calls = self.run_deploy(VERIFY_E2E_ENDPOINT="1")

        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
