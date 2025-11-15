import {
  isFilled,
  Message,
  MessageType,
  Primitive,
  Transport,
} from "silentium";

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export function Shot<T>($target: MessageType<T>, $trigger: MessageType) {
  return Message<T>((transport) => {
    const targetSync = Primitive($target);
    targetSync.primitive();
    $trigger.to(
      Transport(() => {
        const value = targetSync.primitive();
        if (isFilled(value)) {
          transport.use(value);
        }
      }),
    );
  });
}
