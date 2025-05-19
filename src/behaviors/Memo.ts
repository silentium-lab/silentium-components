import { patron, sourceOf, SourceType, value } from "silentium";

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export const memo = <T>(baseSrc: SourceType<T>) => {
  const result = sourceOf<T>();
  let lastValue: T | null = null;

  value(
    baseSrc,
    patron((v) => {
      if (v !== lastValue) {
        result.give(v);
        lastValue = v;
      }
    }),
  );

  return result.value;
};
