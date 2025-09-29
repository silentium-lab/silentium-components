import { all, DataType, isFilled, primitive, SourceType } from "silentium";

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const part = <
  R,
  T extends Record<string, unknown> | Array<unknown> = any,
  K extends string = any,
>(
  baseSrc: SourceType<T>,
  keySrc: DataType<K>,
): SourceType<R> => {
  const baseSync = primitive(baseSrc.value);
  const keySync = primitive(keySrc);
  return {
    value: (u) => {
      all(
        baseSrc.value,
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
    },
    give: (value: R) => {
      const key = keySync.primitive();
      if (isFilled(key)) {
        baseSrc.give({
          ...baseSync.primitive(),
          [key]: value,
        } as T);
      }
    },
  };
};
