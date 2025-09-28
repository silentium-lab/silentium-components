import { DataType, DataUserType, filtered, shared } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const deadline = <T>(
  error: DataUserType<Error>,
  baseSrc: DataType<T>,
  timeoutSrc: DataType<number>,
): DataType<T> => {
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

      const f = filtered(s.value, () => !timeoutReached);
      f(u);

      s.value(() => {
        timeoutReached = true;
      });
    });
  };
};
