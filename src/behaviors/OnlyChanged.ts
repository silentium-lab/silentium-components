import {
  give,
  guestCast,
  source,
  sourceSync,
  SourceType,
  value,
} from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export const onlyChanged = <T>(baseSrc: SourceType<T>) => {
  let firstValue = sourceSync(baseSrc, null).syncValue();
  return source<T>((g) => {
    value(
      baseSrc,
      guestCast<T>(g, (v) => {
        if (firstValue === null) {
          firstValue = v;
        } else if (firstValue !== v) {
          give(v, g);
        }
      }),
    );
  });
};
