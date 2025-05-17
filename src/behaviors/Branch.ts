import { patron, patronOnce, sourceOf, SourceType, value } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branch = <Then, Else>(
  conditionSrc: SourceType<boolean>,
  thenSrc: SourceType<Then>,
  elseSrc?: SourceType<Else>,
): SourceType<Then | Else> => {
  const result = sourceOf<Then | Else>();

  value(
    conditionSrc,
    patron((v) => {
      if (v === true) {
        value(
          thenSrc,
          patronOnce((v) => {
            result.give(v);
          }),
        );
      } else if (elseSrc !== undefined) {
        value(
          elseSrc,
          patronOnce((v) => {
            result.give(v);
          }),
        );
      }
    }),
  );

  return result.value;
};
