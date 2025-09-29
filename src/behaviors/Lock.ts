import { DataType, filtered } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export const lock = <T>(
  baseSrc: DataType<T>,
  lockSrc: DataType<boolean>,
): DataType<T> => {
  return (u) => {
    let locked = false;
    lockSrc((newLock) => {
      locked = newLock;
    });
    const i = filtered(baseSrc, () => !locked);
    i(u);
  };
};
