import { EventType, Filtered } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export function Lock<T>(
  baseSrc: EventType<T>,
  lockSrc: EventType<boolean>,
): EventType<T> {
  return (user) => {
    let locked = false;
    lockSrc((newLock) => {
      locked = newLock;
    });
    const i = Filtered(baseSrc, () => !locked);
    i(user);
  };
}
