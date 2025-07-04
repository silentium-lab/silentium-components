import { filtered, I, Information, O, Owner, poolStateless } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const deadline = <T>(
  error: Owner<Error>,
  baseSrc: Information<T>,
  timeoutSrc: Information<number>,
) => {
  let timerHead: unknown = null;
  return I((o) => {
    timeoutSrc.value(
      O((timeout) => {
        if (timerHead) {
          clearTimeout(timerHead as number);
        }
        let timeoutReached = false;

        timerHead = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          error.give(new Error("Timeout reached in Deadline class"));
        }, timeout);

        const [basePool] = poolStateless(baseSrc);
        filtered(basePool, () => !timeoutReached).value(o);

        basePool.value(
          O(() => {
            timeoutReached = true;
          }),
        );
      }),
    );
  });
};
