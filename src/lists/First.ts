import { Applied, Event, EventType } from "silentium";

/**
 * Represents the first element Of an array.
 */
export function First<T extends Array<unknown>>(
  $base: EventType<T>,
): EventType<T[0]> {
  return Event((user) => {
    Applied($base, (a) => a[0]).event(user);
  });
}
