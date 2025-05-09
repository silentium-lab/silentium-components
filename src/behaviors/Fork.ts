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
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export const fork = <T, Then, Else>(
  conditionSrc: SourceType<T>,
  predicate: (v: T) => boolean,
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
      if (predicate(v)) {
        thenPatron = patron(result);
        value(thenSrc, thenPatron);
      } else if (elseSrc) {
        elsePatron = patron(result);
        value(elseSrc, elsePatron);
      }
    }),
  );

  return resultResettable;
};
