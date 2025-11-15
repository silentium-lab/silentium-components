import { Message, MessageType, Transport } from "silentium";

/**
 * Logical negation of message
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export function Not($base: MessageType<boolean>) {
  return Message<boolean>((transport) => {
    $base.to(
      Transport((v) => {
        transport.use(!v);
      }),
    );
  });
}
