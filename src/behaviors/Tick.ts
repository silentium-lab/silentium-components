import { I, Information, O } from "silentium";

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
export const tick = <T>(baseSrc: Information<T>) => {
  const i = I((o) => {
    let microtaskScheduled = false;
    let lastValue: T | null = null;

    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          o.give(lastValue);
          lastValue = null;
        }
      });
    };

    baseSrc.value(
      O((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      }),
    );
  });
  i.subInfo(baseSrc);

  return i;
};
