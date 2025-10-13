import { Applied, EventType } from "silentium";

/**
 * Represents the first element Of an array.
 */
export const first = <T extends Array<unknown>>(
  baseSrc: EventType<T>,
): EventType<T[0]> => {
  return (u) => {
    Applied(baseSrc, (a) => a[0])(u);
  };
};
