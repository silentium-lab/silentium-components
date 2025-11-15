import {
  isFilled,
  Message,
  MessageType,
  Primitive,
  Transport,
} from "silentium";

/**
 * Defer one source after another, gives values Of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export function Deferred<T>(
  $base: MessageType<T>,
  $trigger: MessageType<unknown>,
) {
  return Message((transport) => {
    const base = Primitive($base);
    $trigger.to(
      Transport(() => {
        const value = base.primitive();
        if (isFilled(value)) {
          transport.use(value);
        }
      }),
    );
  });
}
