import { Message, MessageType } from "silentium";

/**
 * Active polling of $base message
 * synchronized with $trigger message
 */
export function Polling<T>(
  $base: MessageType<T>,
  $trigger: MessageType<unknown>,
) {
  return Message<T>(function PollingImpl(r) {
    $trigger.then(() => {
      $base.then(r);
    });
  });
}
