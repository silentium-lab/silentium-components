import { InformationType } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export const onlyChanged = <T>(
  baseSrc: InformationType<T>,
): InformationType<T> => {
  let firstValue = false;
  return (o) => {
    baseSrc((v) => {
      if (firstValue === false) {
        firstValue = true;
      } else {
        o(v);
      }
    });
  };
};
