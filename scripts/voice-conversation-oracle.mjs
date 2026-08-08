function assertFiniteNumber(value, name) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

export function analyzeConversationTimeline(
  samples,
  {
    speechStartMs,
    speechEndMs,
    assistantTurnStartMs,
    threshold = 0.003,
    quietGapMs = 800,
    minimumActiveSamples = 3,
    responseGraceMs = 300,
  },
) {
  assertFiniteNumber(speechStartMs, "speechStartMs");
  assertFiniteNumber(speechEndMs, "speechEndMs");
  assertFiniteNumber(assistantTurnStartMs, "assistantTurnStartMs");
  if (speechStartMs < 0 || speechEndMs <= speechStartMs) {
    throw new RangeError("speechEndMs must be greater than speechStartMs");
  }
  if (assistantTurnStartMs < speechEndMs) {
    throw new RangeError("assistantTurnStartMs must follow speechEndMs");
  }
  if (!Array.isArray(samples) || samples.length === 0) {
    throw new TypeError("samples must be a non-empty array");
  }

  const bursts = [];
  let activeBurst = null;
  let previousTimestamp = -Infinity;

  const closeBurst = () => {
    if (activeBurst && activeBurst.activeSamples >= minimumActiveSamples) {
      bursts.push(activeBurst);
    }
    activeBurst = null;
  };

  for (const sample of samples) {
    const timestampMs = Number(sample.timestampMs);
    const rms = Number(sample.rms);
    assertFiniteNumber(timestampMs, "sample.timestampMs");
    assertFiniteNumber(rms, "sample.rms");
    if (timestampMs < previousTimestamp) {
      throw new RangeError("samples must be sorted by timestampMs");
    }
    previousTimestamp = timestampMs;

    if (rms > threshold) {
      if (activeBurst && timestampMs - activeBurst.lastActiveMs >= quietGapMs) {
        closeBurst();
      }
      if (!activeBurst) {
        activeBurst = {
          startMs: timestampMs,
          endMs: timestampMs,
          lastActiveMs: timestampMs,
          activeSamples: 0,
          maxRms: 0,
        };
      }
      activeBurst.endMs = timestampMs;
      activeBurst.lastActiveMs = timestampMs;
      activeBurst.activeSamples += 1;
      activeBurst.maxRms = Math.max(activeBurst.maxRms, rms);
    } else if (activeBurst && timestampMs - activeBurst.lastActiveMs >= quietGapMs) {
      closeBurst();
    }
  }
  closeBurst();

  const publicBursts = bursts.map(({ lastActiveMs: _lastActiveMs, ...burst }) => burst);
  const greetingBursts = publicBursts.filter(
    (burst) => burst.startMs < speechStartMs && burst.endMs < speechStartMs,
  );
  const responseBursts = publicBursts.filter(
    (burst) => burst.startMs >= assistantTurnStartMs + responseGraceMs,
  );

  return {
    bursts: publicBursts,
    greetingBursts,
    responseBursts,
    hasGreeting: greetingBursts.length > 0,
    hasPostInputResponse: responseBursts.length > 0,
  };
}
