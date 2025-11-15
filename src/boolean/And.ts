import { All, Message, MessageType, Transport } from "silentium";

/**
 * Logical AND over two messages
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
export function And($one: MessageType<boolean>, $two: MessageType<boolean>) {
  return Message<boolean>((transport) => {
    All($one, $two).to(
      Transport(([one, two]) => {
        transport.use(one && two);
      }),
    );
  });
}
