import { Applied, EventType } from "silentium";

/**
 * Represents the first element Of an array.
 */
export function First<T extends Array<unknown>>(
  baseSrc: EventType<T>,
): EventType<T[0]> {
  return (user) => {
    Applied(baseSrc, (a) => a[0])(user);
  };
}
