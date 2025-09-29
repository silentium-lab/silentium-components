import { DataType } from "silentium";

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export const memo = <T>(baseSrc: DataType<T>): DataType<T> => {
  return (u) => {
    let lastValue: T | null = null;

    baseSrc((v) => {
      if (v !== lastValue) {
        u(v);
        lastValue = v;
      }
    });
  };
};
