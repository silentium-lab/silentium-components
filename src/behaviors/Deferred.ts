import { EventType, isFilled, Primitive } from "silentium";

/**
 * Defer one source after another, gives values Of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export function Deferred<T>(
  baseSrc: EventType<T>,
  triggerSrc: EventType<unknown>,
): EventType<T> {
  return (user) => {
    const baseSync = Primitive(baseSrc);
    triggerSrc(() => {
      const value = baseSync.primitive();
      if (isFilled(value)) {
        user(value);
      }
    });
  };
}
