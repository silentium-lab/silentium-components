import { filtered, InformationType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export const lock = <T>(
  baseSrc: InformationType<T>,
  lockSrc: InformationType<boolean>,
): InformationType<T> => {
  let locked = false;
  const i = filtered(baseSrc, () => !locked);

  return (o) => {
    lockSrc((newLock) => {
      locked = newLock;
    });
    i(o);
  };
};
