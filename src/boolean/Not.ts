import { Message, MessageType } from "silentium";

/**
 * Logical negation of message
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export function Not($base: MessageType<boolean>) {
  return Message<boolean>(function NotImpl(r) {
    $base.then((v) => {
      r(!v);
    });
  });
}
