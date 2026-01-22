import { Message, MessageType, ResetSilenceCache } from "silentium";

/**
 * Active polling of $base message
 * synchronized with $trigger message
 * can return same values
 */
export function Polling<T>(
  $base: MessageType<T>,
  $trigger: MessageType<unknown>,
) {
  return Message<T>(function PollingImpl(r, reject) {
    $trigger
      .then(() => {
        r(ResetSilenceCache as T);
        $base.then(r).catch(reject);
      })
      .catch(reject);
  });
}
