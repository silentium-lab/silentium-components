import { Message, MessageType, Transport } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export function OnlyChanged<T>($base: MessageType<T>) {
  return Message<T>((transport) => {
    let first = false;
    $base.to(
      Transport((v) => {
        if (first === false) {
          first = true;
        } else {
          transport.use(v);
        }
      }),
    );
  });
}
