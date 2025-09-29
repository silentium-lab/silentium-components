import { DataType, isFilled, primitive } from "silentium";

/**
 * Defer one source after another, gives values of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export const deferred = <T>(
  baseSrc: DataType<T>,
  triggerSrc: DataType<unknown>,
): DataType<T> => {
  return (u) => {
    const baseSync = primitive(baseSrc);
    triggerSrc(() => {
      const value = baseSync.primitive();
      if (isFilled(value)) {
        u(value);
      }
    });
  };
};
