import { applied, EventType } from "silentium";

/**
 * Represents the first element of an array.
 */
export const first = <T extends Array<unknown>>(
  baseSrc: EventType<T>,
): EventType<T[0]> => {
  return (u) => {
    applied(baseSrc, (a) => a[0])(u);
  };
};
