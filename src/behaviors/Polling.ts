import { Message, MessageType, Transport } from "silentium";

/**
 * Active polling of $base message
 * synchronized with $trigger message
 */
export function Polling<T>($base: MessageType<T>, $trigger: MessageType<T>) {
  return Message<T>((transport) => {
    $trigger.to(
      Transport(() => {
        $base.to(transport);
      }),
    );
  });
}
