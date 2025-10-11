import { EventType, filtered, shared, EventUserType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const deadline = <T>(
  error: EventUserType<Error>,
  baseSrc: EventType<T>,
  timeoutSrc: EventType<number>,
): EventType<T> => {
  return (u) => {
    let timerHead: unknown = null;

    const s = shared(baseSrc, true);

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

      const f = filtered(s.event, () => !timeoutReached);
      f(u);

      s.event(() => {
        timeoutReached = true;
      });
    });
  };
};
