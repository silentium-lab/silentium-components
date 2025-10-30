import { Event, EventType, Filtered, Transport } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export function Lock<T>(
  $base: EventType<T>,
  $lock: EventType<boolean>,
): EventType<T> {
  return Event((transport) => {
    let locked = false;
    $lock.event(
      Transport((newLock) => {
        locked = newLock;
      }),
    );
    const i = Filtered($base, () => !locked);
    i.event(transport);
  });
}
