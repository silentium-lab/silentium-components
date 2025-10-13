import { EventType, isFilled, Primitive } from "silentium";

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export function Shot<T>(
  targetSrc: EventType<T>,
  triggerSrc: EventType,
): EventType<T> {
  return (user) => {
    const targetSync = Primitive(targetSrc);

    triggerSrc(() => {
      const value = targetSync.primitive();
      if (isFilled(value)) {
        user(value);
      }
    });
  };
}
