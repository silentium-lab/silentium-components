import { Message, MessageType, Tap } from "silentium";

/**
 * Active polling of $base message
 * synchronized with $trigger message
 */
export function Polling<T>($base: MessageType<T>, $trigger: MessageType<T>) {
  return Message<T>(function () {
    $trigger.pipe(
      Tap(() => {
        $base.pipe(this);
      }),
    );
  });
}
