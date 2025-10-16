import { All, EventType } from "silentium";

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export function Path<R, T extends object | Array<any>, K extends string = any>(
  baseSrc: EventType<T>,
  keySrc: EventType<K>,
): EventType<R> {
  return (user) => {
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
        user(value as R);
      }
    });
  };
}
