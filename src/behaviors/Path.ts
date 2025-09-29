import { all, DataType } from "silentium";

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const path = <
  R,
  T extends Record<string, unknown> | Array<unknown> = any,
  K extends string = any,
>(
  baseSrc: DataType<T>,
  keySrc: DataType<K>,
): DataType<R> => {
  return (u) => {
    all(
      baseSrc,
      keySrc,
    )(([base, key]) => {
      const keyChunks = key.split(".");
      let value: unknown = base;
      keyChunks.forEach((keyChunk) => {
        value = (value as Record<string, unknown>)[keyChunk];
      });

      if (value !== undefined && value !== base) {
        u(value as R);
      }
    });
  };
};
