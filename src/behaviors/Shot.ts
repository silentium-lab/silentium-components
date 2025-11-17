import { isFilled, Message, MessageType, Primitive, Tap } from "silentium";

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export function Shot<T>($target: MessageType<T>, $trigger: MessageType) {
  return Message<T>(function () {
    const targetSync = Primitive($target);
    targetSync.primitive();
    $trigger.pipe(
      Tap(() => {
        const value = targetSync.primitive();
        if (isFilled(value)) {
          this.use(value);
        }
      }),
    );
  });
}
