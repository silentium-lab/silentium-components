import { all, I, Information, O } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export const or = (
  oneSrc: Information<boolean>,
  twoSrc: Information<boolean>,
) => {
  return I((o) => {
    all(oneSrc, twoSrc).value(
      O(([one, two]) => {
        o.give(one || two);
      }),
    );
  });
};
