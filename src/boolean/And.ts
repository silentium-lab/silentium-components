import { All, Message, MessageType, Tap } from "silentium";

/**
 * Logical AND over two messages
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
export function And($one: MessageType<boolean>, $two: MessageType<boolean>) {
  return Message<boolean>(function () {
    All($one, $two).pipe(
      Tap(([one, two]) => {
        this.use(!!(one && two));
      }),
    );
  });
}
