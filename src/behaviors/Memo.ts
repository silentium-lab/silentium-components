import { isFilled, Message, MessageType, Transport } from "silentium";

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export function Memo<T>($base: MessageType<T>) {
  return Message<T>((transport) => {
    let last: T | null = null;
    $base.to(
      Transport((v) => {
        if (v !== last && isFilled(v)) {
          transport.use(v);
          last = v;
        }
      }),
    );
  });
}
