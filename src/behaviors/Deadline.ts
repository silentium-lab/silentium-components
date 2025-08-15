import {
  filtered,
  InformationType,
  OwnerType,
  sharedStateless,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export const deadline = <T>(
  error: OwnerType<Error>,
  baseSrc: InformationType<T>,
  timeoutSrc: InformationType<number>,
): InformationType<T> => {
  let timerHead: unknown = null;
  return (o) => {
    const [baseShared, pool] = sharedStateless(baseSrc);

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

      const f = filtered(baseShared, () => !timeoutReached);
      f(o);

      baseShared(() => {
        timeoutReached = true;
      });
    });

    return () => {
      pool.destroy();
    };
  };
};
