import { all, EventType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export const or = (
  oneSrc: EventType<boolean>,
  twoSrc: EventType<boolean>,
): EventType<boolean> => {
  return (u) => {
    all(
      oneSrc,
      twoSrc,
    )(([one, two]) => {
      u(one || two);
    });
  };
};
