import { All, EventType, isFilled, Primitive, SourceType } from "silentium";

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export function Part<
  R,
  T extends Record<string, unknown> | Array<unknown> = any,
  K extends string = any,
>(baseSrc: SourceType<T>, keySrc: EventType<K>): SourceType<R> {
  const baseSync = Primitive(baseSrc.event);
  const keySync = Primitive(keySrc);
  return {
    event: (user) => {
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
          user(value as R);
        }
      });
    },
    use: (value: R) => {
      const key = keySync.primitive();
      if (isFilled(key)) {
        baseSrc.use({
          ...baseSync.primitive(),
          [key]: value,
        } as T);
      }
    },
  };
}
