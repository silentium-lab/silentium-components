import { give, GuestType, sourceCombined, SourceType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export const or = (
  oneSrc: SourceType<boolean>,
  twoSrc: SourceType<boolean>,
) => {
  return sourceCombined(
    oneSrc,
    twoSrc,
  )((guest: GuestType<boolean>, one, two) => {
    give(one || two, guest);
  });
};
