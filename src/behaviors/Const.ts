import { Message, MessageType, ResetSilenceCache } from "silentium";

/**
 * Constant value that will be
 * returned on each value from
 * the $trigger message
 */
export function Constant<T>(
  permanent: T,
  $trigger: MessageType,
): MessageType<T> {
  return Message<T>(function ConstantImpl(resolve, reject) {
    $trigger.catch(reject).then(() => {
      resolve(permanent);
      // Do cache reset, it gives ability to send constant of same value many times
      resolve(ResetSilenceCache as T);
    });
  });
}
