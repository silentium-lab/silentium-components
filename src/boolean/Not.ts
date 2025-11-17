import { Message, MessageType, Tap } from "silentium";

/**
 * Logical negation of message
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export function Not($base: MessageType<boolean>) {
  return Message<boolean>(function () {
    $base.pipe(
      Tap((v) => {
        this.use(!v);
      }),
    );
  });
}
