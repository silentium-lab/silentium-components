import {
  destroy,
  guestDisposable,
  patron,
  patronOnce,
  sourceOf,
  sourceResettable,
  SourceType,
  subSource,
  value,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export const lock = <T>(
  baseSrc: SourceType<T>,
  lockSrc: SourceType<unknown>,
) => {
  const result = sourceOf();
  const resultResettable = sourceResettable(result, lockSrc);
  let locked = false;
  subSource(result, baseSrc);

  value(baseSrc, patron(guestDisposable(result.give, () => locked)));

  value(
    lockSrc,
    patronOnce(() => {
      locked = true;
      destroy([result]);
    }),
  );

  return resultResettable.value;
};
