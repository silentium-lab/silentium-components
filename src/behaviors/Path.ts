import { all, I, Information, O } from "silentium";

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const path = <
  T extends Record<string, unknown> | Array<unknown>,
  K extends string,
>(
  baseSrc: Information<T>,
  keySrc: Information<K>,
) => {
  return I((o) => {
    all(baseSrc, keySrc).value(
      O(([base, key]) => {
        const keyChunks = key.split(".");
        let value: unknown = base;
        keyChunks.forEach((keyChunk) => {
          value = (value as Record<string, unknown>)[keyChunk];
        });

        if (value !== undefined && value !== base) {
          o.give(value);
        }
      }),
    );
  });
};
