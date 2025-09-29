import { all, DataType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
export const and = (
  oneSrc: DataType<boolean>,
  twoSrc: DataType<boolean>,
): DataType<boolean> => {
  return (u) => {
    all(
      oneSrc,
      twoSrc,
    )(([one, two]) => {
      u(one && two);
    });
  };
};
