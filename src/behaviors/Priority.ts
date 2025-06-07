import {
  firstVisit,
  give,
  GuestType,
  patron,
  sourceOf,
  SourceType,
  value,
} from "silentium";

export const priority = <T>(
  sources: SourceType<T>[],
  resetSrc: SourceType<unknown>,
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
    sources.forEach((source, index) => {
      value(
        source,
        patron((v) => {
          sourceHandler(v, index);
        }),
      );
    });

    value(
      resetSrc,
      patron(() => {
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
