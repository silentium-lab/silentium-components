import { All, EventType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
export const and = (
  oneSrc: EventType<boolean>,
  twoSrc: EventType<boolean>,
): EventType<boolean> => {
  return (u) => {
    All(
      oneSrc,
      twoSrc,
    )(([one, two]) => {
      u(one && two);
    });
  };
};
