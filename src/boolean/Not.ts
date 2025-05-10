import { give, guestCast, GuestType, SourceType, value } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export const not = (baseSrc: SourceType<boolean>) => {
  return (g: GuestType<boolean>) => {
    value(
      baseSrc,
      guestCast(g, (base) => {
        give(!base, g);
      }),
    );
  };
};
