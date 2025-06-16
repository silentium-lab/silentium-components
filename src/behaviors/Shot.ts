import {
  sourceOf,
  sourceResettable,
  sourceSync,
  SourceType,
  systemPatron,
  value,
} from "silentium";

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export const shot = <T>(baseSrc: SourceType<T>, shotSrc: SourceType) => {
  const resetResult = sourceOf();
  const result = sourceOf<T>();

  const baseSrcSync = sourceSync(baseSrc, null);
  value(
    shotSrc,
    systemPatron(() => {
      if (baseSrcSync.syncValue() !== null) {
        result.give(baseSrcSync.syncValue() as T);
        resetResult.give(1);
      }
    }),
  );

  return sourceResettable(result, resetResult);
};
