import { All, EventType, IsFilled, Primitive, SourceType } from "silentium";

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const part = <
  R,
  T extends Record<string, unknown> | Array<unknown> = Any,
  K extends string = Any,
>(
  baseSrc: SourceType<T>,
  keySrc: EventType<K>,
): SourceType<R> => {
  const baseSync = Primitive(baseSrc.event);
  const keySync = Primitive(keySrc);
  return {
    event: (u) => {
      All(
        baseSrc.event,
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
    use: (value: R) => {
      const key = keySync.Primitive();
      if (IsFilled(key)) {
        baseSrc.use({
          ...baseSync.Primitive(),
          [key]: value,
        } as T);
      }
    },
  };
};
