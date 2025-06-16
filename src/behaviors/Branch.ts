import {
  firstVisit,
  GuestType,
  sourceOf,
  sourceResettable,
  SourceType,
  systemPatron,
  value,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branch = <Then, Else>(
  conditionSrc: SourceType<boolean>,
  thenSrc: SourceType<Then>,
  elseSrc?: SourceType<Else>,
): SourceType<Then | Else> => {
  const resetSrc = sourceOf();
  const result = sourceOf<Then | Else>();
  const resultSrc = sourceResettable(result, resetSrc);

  const visited = firstVisit(() => {
    value(
      conditionSrc,
      systemPatron((v) => {
        resetSrc.give(1);
        if (v === true) {
          value(thenSrc, result.give);
        } else if (elseSrc !== undefined) {
          value(elseSrc, result.give);
        }
      }),
    );
  });

  return (g: GuestType<Then | Else>) => {
    visited();
    resultSrc.value(g);
  };
};
