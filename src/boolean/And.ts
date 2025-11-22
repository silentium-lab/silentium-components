import { All, Message, MessageType } from "silentium";

/**
 * Logical AND over two messages
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
export function And($one: MessageType<boolean>, $two: MessageType<boolean>) {
  return Message<boolean>(function AndImpl(r) {
    All($one, $two).then(([one, two]) => {
      r(!!(one && two));
    });
  });
}
