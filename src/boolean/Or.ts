import { All, Message, MessageType } from "silentium";

/**
 * Logical OR over two messages
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export function Or($one: MessageType<boolean>, $two: MessageType<boolean>) {
  return Message<boolean>(function OrImpl(r) {
    All($one, $two).then(([one, two]) => {
      r(!!(one || two));
    });
  });
}
