import { All, EventType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export function Or(
  oneSrc: EventType<boolean>,
  twoSrc: EventType<boolean>,
): EventType<boolean> {
  return (user) => {
    All(
      oneSrc,
      twoSrc,
    )(([one, two]) => {
      user(one || two);
    });
  };
}
