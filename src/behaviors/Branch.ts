import {
  sourceOf,
  SourceType,
  sourceResettable,
  value,
  patron,
  removePatronFromPools,
  GuestObjectType,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branch = <Then, Else>(
  conditionSrc: SourceType<boolean>,
  thenSrc: SourceType<Then>,
  elseSrc?: SourceType<Else>,
): SourceType<Then | Else> => {
  const result = sourceOf<Then | Else>();
  const reset = sourceOf();
  const resultResettable = sourceResettable(result, reset);
  let thenPatron: GuestObjectType<Then> | undefined;
  let elsePatron: GuestObjectType<Else> | undefined;

  value(
    conditionSrc,
    patron((v) => {
      reset.give(1);
      if (thenPatron) {
        removePatronFromPools(thenPatron);
      }
      if (elsePatron) {
        removePatronFromPools(elsePatron);
      }
      if (v === true) {
        thenPatron = patron(result);
        value(thenSrc, thenPatron);
      } else if (elseSrc !== undefined) {
        elsePatron = patron(result);
        value(elseSrc, elsePatron);
      }
    }),
  );

  return resultResettable;
};
