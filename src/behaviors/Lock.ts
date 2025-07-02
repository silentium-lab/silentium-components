import { filtered, Information, O } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export const lock = <T>(
  baseSrc: Information<T>,
  lockSrc: Information<boolean>,
) => {
  let locked = false;

  const i = filtered(baseSrc, () => !locked);

  i.executed(() => {
    lockSrc.value(
      O((newLock) => {
        locked = newLock;
      }),
    );
  });

  return i;
};
