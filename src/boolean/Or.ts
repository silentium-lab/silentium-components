import { all, InformationType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export const or = (
  oneSrc: InformationType<boolean>,
  twoSrc: InformationType<boolean>,
): InformationType<boolean> => {
  return (o) => {
    all(
      oneSrc,
      twoSrc,
    )(([one, two]) => {
      o(one || two);
    });
  };
};
