import { I, Information, O } from "silentium";

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export const memo = <T>(baseSrc: Information<T>) => {
  let lastValue: T | null = null;

  return I((o) => {
    baseSrc.value(
      O((v) => {
        if (v !== lastValue) {
          o.give(v);
          lastValue = v;
        }
      }),
    );
  });
};
