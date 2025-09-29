import { DataType, isFilled, primitive } from "silentium";

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export const shot = <T>(
  targetSrc: DataType<T>,
  triggerSrc: DataType,
): DataType<T> => {
  return (u) => {
    const targetSync = primitive(targetSrc);

    triggerSrc(() => {
      const value = targetSync.primitive();
      if (isFilled(value)) {
        u(value);
      }
    });
  };
};
