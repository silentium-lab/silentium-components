import { give, guestCast, source, SourceType, value } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export const onlyChanged = <T>(baseSrc: SourceType<T>) => {
  let firstValue = false;
  return source<T>((g) => {
    value(
      baseSrc,
      guestCast<T>(g, (v) => {
        if (firstValue === false) {
          firstValue = true;
        } else {
          give(v, g);
        }
      }),
    );
  });
};
