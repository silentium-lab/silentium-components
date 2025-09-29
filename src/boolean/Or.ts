import { all, DataType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export const or = (
  oneSrc: DataType<boolean>,
  twoSrc: DataType<boolean>,
): DataType<boolean> => {
  return (u) => {
    all(
      oneSrc,
      twoSrc,
    )(([one, two]) => {
      u(one || two);
    });
  };
};
