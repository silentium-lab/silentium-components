import { EventType, Filtered, Shared, EventUserType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export function Deadline<T>(
  error: EventUserType<Error>,
  baseSrc: EventType<T>,
  timeoutSrc: EventType<number>,
): EventType<T> {
  return (user) => {
    let timerHead: unknown = null;

    const s = Shared(baseSrc, true);

    timeoutSrc((timeout) => {
      if (timerHead) {
        clearTimeout(timerHead as number);
      }
      let timeoutReached = false;

      timerHead = setTimeout(() => {
        if (timeoutReached) {
          return;
        }
        timeoutReached = true;
        error(new Error("Timeout reached in Deadline class"));
      }, timeout);

      const f = Filtered(s.event, () => !timeoutReached);
      f(user);

      s.event(() => {
        timeoutReached = true;
      });
    });
  };
}
