import { Event, EventType, isFilled, Primitive, Transport } from "silentium";

/**
 * Defer one source after another, gives values Of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export function Deferred<T>(
  $base: EventType<T>,
  $trigger: EventType<unknown>,
): EventType<T> {
  return Event((transport) => {
    const base = Primitive($base);
    $trigger.event(
      Transport(() => {
        const value = base.primitive();
        if (isFilled(value)) {
          transport.use(value);
        }
      }),
    );
  });
}
