import { I, Information, O } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export const onlyChanged = <T>(baseSrc: Information<T>) => {
  let firstValue = false;
  return I<T>((o) => {
    baseSrc.value(
      O((v) => {
        if (firstValue === false) {
          firstValue = true;
        } else {
          o.give(v);
        }
      }),
    );
  });
};
