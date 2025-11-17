import { Message, MessageType, Tap } from "silentium";

/**
 * Constant value that will be
 * returned on each value from
 * the $trigger message
 */
export function Constant<T>(
  permanent: T,
  $trigger: MessageType,
): MessageType<T> {
  return Message(function () {
    $trigger.pipe(
      Tap(() => {
        this.use(permanent);
      }),
    );
  });
}
