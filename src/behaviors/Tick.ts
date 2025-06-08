import {
  give,
  sourceOf,
  SourceType,
  subSource,
  systemPatron,
  value,
} from "silentium";

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
export const tick = <T>(baseSrc: SourceType<T>) => {
  const result = sourceOf<T>();
  subSource(result, baseSrc);

  let microtaskScheduled = false;
  let lastValue: T | null = null;

  const scheduleMicrotask = () => {
    microtaskScheduled = true;
    queueMicrotask(() => {
      microtaskScheduled = false;
      if (lastValue !== null) {
        give(lastValue, result);
        lastValue = null;
      }
    });
  };

  value(
    baseSrc,
    systemPatron((v) => {
      lastValue = v;
      if (!microtaskScheduled) {
        scheduleMicrotask();
      }
    }),
  );

  return result;
};
