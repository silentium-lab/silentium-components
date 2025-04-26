import {
  give,
  guestCast,
  GuestType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

export const path = <T extends Record<string, unknown>, K extends string>(
  baseSrc: SourceType<T>,
  keySrc: SourceType<K>,
) => {
  return (g: GuestType<T[K]>) => {
    value(
      sourceAll([baseSrc, keySrc]),
      guestCast(g, ([base, key]) => {
        const keyChunks = key.split(".");
        let value: unknown = base;
        keyChunks.forEach((keyChunk) => {
          value = (value as T)[keyChunk];
        });

        if (value !== undefined && value !== base) {
          give(value as T[K], g);
        }
      }),
    );
  };
};
