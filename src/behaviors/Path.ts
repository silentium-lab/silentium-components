import { all, InformationType } from "silentium";

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const path = <
  R,
  T extends Record<string, unknown> | Array<unknown> = any,
  K extends string = any,
>(
  baseSrc: InformationType<T>,
  keySrc: InformationType<K>,
): InformationType<R> => {
  return (o) => {
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
        o(value as R);
      }
    });
  };
};
