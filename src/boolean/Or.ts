import { All, Message, MessageType, Transport } from "silentium";

/**
 * Logical OR over two messages
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export function Or($one: MessageType<boolean>, $two: MessageType<boolean>) {
  return Message<boolean>((transport) => {
    All($one, $two).to(
      Transport(([one, two]) => {
        transport.use(one || two);
      }),
    );
  });
}
