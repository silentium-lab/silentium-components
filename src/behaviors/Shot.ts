import { EventType, IsFilled, Primitive } from "silentium";

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export const shot = <T>(
  targetSrc: EventType<T>,
  triggerSrc: EventType,
): EventType<T> => {
  return (u) => {
    const targetSync = Primitive(targetSrc);

    triggerSrc(() => {
      const value = targetSync.Primitive();
      if (IsFilled(value)) {
        u(value);
      }
    });
  };
};
