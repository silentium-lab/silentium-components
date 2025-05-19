import { give, guestSync, GuestType, SourceType, value } from "silentium";

/**
 * Get's value from source in moment of component call and than return this value every time
 * https://silentium-lab.github.io/silentium-components/#/behaviors/moment
 */
export const moment = <T>(
  baseSrc: SourceType<T>,
  defaultValue?: T,
): SourceType<T> => {
  const guest = guestSync(defaultValue);
  value(baseSrc, guest);

  return (g: GuestType<T>) => {
    give(guest.value(), g);
  };
};
