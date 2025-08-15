import { InformationType } from "silentium";

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export const memo = <T>(baseSrc: InformationType<T>): InformationType<T> => {
  let lastValue: T | null = null;

  return (o) => {
    baseSrc((v) => {
      if (v !== lastValue) {
        o(v);
        lastValue = v;
      }
    });
  };
};
