import { InformationType } from "silentium";

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
export const tick = <T>(baseSrc: InformationType<T>): InformationType<T> => {
  return (o) => {
    let microtaskScheduled = false;
    let lastValue: T | null = null;

    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          o(lastValue);
          lastValue = null;
        }
      });
    };

    baseSrc((v) => {
      lastValue = v;
      if (!microtaskScheduled) {
        scheduleMicrotask();
      }
    });
  };
};
