import { Event, EventType, isFilled, Primitive, Transport } from "silentium";

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export function Shot<T>(
  $target: EventType<T>,
  $trigger: EventType,
): EventType<T> {
  return Event((transport) => {
    const targetSync = Primitive($target);
    targetSync.primitive();

    $trigger.event(
      Transport(() => {
        const value = targetSync.primitive();
        if (isFilled(value)) {
          transport.use(value);
        }
      }),
    );
  });
}
