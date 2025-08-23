import { all, InformationType, TheInformation } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
export const and = (
  oneSrc: InformationType<boolean>,
  twoSrc: InformationType<boolean>,
): InformationType<boolean> => {
  return (o) => {
    all(
      oneSrc,
      twoSrc,
    )(([one, two]) => {
      o(one && two);
    });
  };
};

export class And<T> extends TheInformation<T> {}
