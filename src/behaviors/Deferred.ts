import { isFilled, Message, MessageType, Primitive } from "silentium";

/**
 * Defer one source after another, gives values Of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export function Deferred<T>(
  $base: MessageType<T>,
  $trigger: MessageType<unknown>,
) {
  return Message(function DeferredImpl(r) {
    const base = Primitive($base);
    $trigger.then(() => {
      const value = base.primitive();
      if (isFilled(value)) {
        r(value);
      }
    });
  });
}
