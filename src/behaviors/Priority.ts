import {
  firstVisit,
  give,
  GuestType,
  sourceOf,
  sourceResettable,
  SourceType,
  systemPatron,
  value,
} from "silentium";

export const priority = <T>(
  sources: SourceType<T>[],
  triggerSrc: SourceType<unknown>,
) => {
  const resetSrc = sourceOf();
  const resultSrc = sourceOf<T>();
  const resultResettableSrc = sourceResettable(resultSrc, resetSrc);
  let highestPriorityIndex = 0;

  const visited = firstVisit(() => {
    value(
      triggerSrc,
      systemPatron((v) => {
        highestPriorityIndex = 0;
        let highestPriorityResult;
        sources.forEach((source, index) => {
          value(source, (v) => {
            if (highestPriorityIndex <= index) {
              highestPriorityIndex = index;
              highestPriorityResult = v;
            }
          });
        });
        resetSrc.give(1);
        if (highestPriorityResult !== undefined) {
          give(highestPriorityResult, resultSrc);
        }
      }),
    );
  });

  return (g: GuestType<T>) => {
    visited();
    resultResettableSrc.value(g);
  };
};
