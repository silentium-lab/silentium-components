import { All, EventType } from "silentium";

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const path = <
  R,
  T extends Record<string, unknown> | Array<unknown> = Any,
  K extends string = Any,
>(
  baseSrc: EventType<T>,
  keySrc: EventType<K>,
): EventType<R> => {
  return (u) => {
    All(
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
