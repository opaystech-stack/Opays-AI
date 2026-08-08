import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const harness = fileURLToPath(new URL("./test-voice-browser.mjs", import.meta.url));

test("FULL_CONVERSATION requires an explicit attested speech fixture", () => {
  const environment = {
    ...process.env,
    FULL_CONVERSATION: "1",
    CHROME_PATH: "C:\\nonexistent\\chrome.exe",
    VOICE_URL: "http://127.0.0.1:9/contact/",
  };
  delete environment.FAKE_AUDIO_FILE;
  delete environment.FAKE_AUDIO_METADATA;

  const result = spawnSync(process.execPath, [harness], {
    env: environment,
    encoding: "utf8",
    timeout: 15_000,
  });
  const output = `${result.stdout}\n${result.stderr}`;

  assert.equal(result.status, 1);
  assert.match(output, /FULL_CONVERSATION requires FAKE_AUDIO_FILE/);
});

test("FULL_CONVERSATION rejects an unattested WAV and arbitrary bounds", () => {
  const directory = mkdtempSync(join(tmpdir(), "opays-contract-"));
  const audioFile = join(directory, "fake.wav");
  const metadataFile = join(directory, "fake.json");
  writeFileSync(audioFile, Buffer.from("not-a-piper-wave"));
  writeFileSync(
    metadataFile,
    JSON.stringify({
      schemaVersion: 1,
      generator: "manual",
      validator: "none",
      validated: false,
      audioSha256: "forged",
      speechStartMs: 15_000,
      speechEndMs: 22_500,
    }),
  );
  const result = spawnSync(process.execPath, [harness], {
    env: {
      ...process.env,
      FULL_CONVERSATION: "1",
      FAKE_AUDIO_FILE: audioFile,
      FAKE_AUDIO_METADATA: metadataFile,
      FAKE_SPEECH_START_MS: "0",
      FAKE_SPEECH_END_MS: "1",
      CHROME_PATH: "C:\\nonexistent\\chrome.exe",
      VOICE_URL: "http://127.0.0.1:9/contact/",
    },
    encoding: "utf8",
    timeout: 15_000,
  });
  rmSync(directory, { recursive: true, force: true });
  const output = `${result.stdout}\n${result.stderr}`;

  assert.equal(result.status, 1);
  assert.match(output, /Piper fixture attested by faster-whisper/);
});
