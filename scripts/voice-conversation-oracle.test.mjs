import assert from "node:assert/strict";
import test from "node:test";

import { analyzeConversationTimeline } from "./voice-conversation-oracle.mjs";

function samplesFor(...bursts) {
  const samples = [];
  for (let timestampMs = 0; timestampMs <= 30_000; timestampMs += 100) {
    const active = bursts.some(
      ([startMs, endMs]) => timestampMs >= startMs && timestampMs <= endMs,
    );
    samples.push({ timestampMs, rms: active ? 0.02 : 0.0001 });
  }
  return samples;
}

const window = { speechStartMs: 10_000, speechEndMs: 13_000, assistantTurnStartMs: 14_000 };

test("accepts one greeting before input and one response after input", () => {
  const result = analyzeConversationTimeline(samplesFor([1_000, 2_000], [15_000, 16_000]), window);

  assert.equal(result.hasGreeting, true);
  assert.equal(result.hasPostInputResponse, true);
  assert.equal(result.greetingBursts.length, 1);
  assert.equal(result.responseBursts.length, 1);
});

test("fragmented greeting alone cannot masquerade as a response", () => {
  const result = analyzeConversationTimeline(samplesFor([1_000, 2_000], [4_000, 5_000]), window);

  assert.equal(result.hasGreeting, true);
  assert.equal(result.hasPostInputResponse, false);
});

test("audio spanning the input window is not a post-input response", () => {
  const result = analyzeConversationTimeline(samplesFor([1_000, 2_000], [9_000, 14_000]), window);

  assert.equal(result.hasGreeting, true);
  assert.equal(result.hasPostInputResponse, false);
});

test("a greeting fragment before the final STT marker is not a response", () => {
  const result = analyzeConversationTimeline(samplesFor([1_000, 2_000], [13_500, 13_900]), window);

  assert.equal(result.hasGreeting, true);
  assert.equal(result.hasPostInputResponse, false);
});
