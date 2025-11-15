import { Message, MessageType, Transport } from "silentium";

/**
 * Constant value that will be
 * returned on each value from
 * the $trigger message
 */
export function Constant<T>(
  permanent: T,
  $trigger: MessageType,
): MessageType<T> {
  return Message((transport) => {
    $trigger.to(
      Transport(() => {
        transport.use(permanent);
      }),
    );
  });
}
