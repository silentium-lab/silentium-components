import {
  firstVisit,
  give,
  GuestType,
  sourceOf,
  SourceType,
  systemPatron,
  value,
} from "silentium";

export const priority = <T>(
  sources: SourceType<T>[],
  triggerSrc: SourceType<unknown>,
) => {
  const resultSrc = sourceOf<T>();
  let highestPriorityIndex = 0;

  const sourceHandler = (v: T, index: number) => {
    if (highestPriorityIndex <= index) {
      highestPriorityIndex = index;
      give(v, resultSrc);
    }
  };

  const visited = firstVisit(() => {
    value(
      triggerSrc,
      systemPatron(() => {
        highestPriorityIndex = 0;
        sources.forEach((source, index) => {
          value(source, (v) => {
            sourceHandler(v, index);
          });
        });
      }),
    );
  });

  return (g: GuestType<T>) => {
    visited();
    resultSrc.value(g);
  };
};
