import {
  give,
  patron,
  sourceAll,
  sourceOf,
  SourceType,
  subSourceMany,
  value,
} from "silentium";

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const path = <
  T extends Record<string, unknown> | Array<unknown>,
  K extends string,
>(
  baseSrc: SourceType<T>,
  keySrc: SourceType<K>,
) => {
  const pathSrc = sourceOf<unknown>();
  subSourceMany(pathSrc, [baseSrc, keySrc]);

  value(
    sourceAll([baseSrc, keySrc]),
    patron(([base, key]) => {
      const keyChunks = key.split(".");
      let value: unknown = base;
      keyChunks.forEach((keyChunk) => {
        value = (value as Record<string, unknown>)[keyChunk];
      });

      if (value !== undefined && value !== base) {
        give(value, pathSrc);
      }
    }),
  );

  return pathSrc.value;
};
