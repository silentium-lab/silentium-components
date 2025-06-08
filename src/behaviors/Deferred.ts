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
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export const deferred = <T>(
  baseSrc: SourceType<T>,
  triggerSrc: SourceType<unknown>,
) => {
  const result = sourceResettable<T>(sourceOf(), baseSrc as SourceType);

  const visited = firstVisit(() => {
    value(
      triggerSrc,
      systemPatron(() => {
        value(baseSrc, result);
      }),
    );
  });

  return (g: GuestType<T>) => {
    visited();
    value(result, g);
  };
};
