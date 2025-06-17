import {
  firstVisit,
  GuestType,
  sourceOf,
  SourceType,
  systemPatron,
  value,
} from "silentium";

export const polling = <T>(
  targetSrc: SourceType<T>,
  triggerSrc: SourceType,
): SourceType<T> => {
  const resultSrc = sourceOf<T>();

  const visited = firstVisit(() => {
    value(
      triggerSrc,
      systemPatron(() => {
        value(targetSrc, resultSrc);
      }),
    );
  });

  return (g: GuestType<T>) => {
    visited();
    resultSrc.value(g);
  };
};
