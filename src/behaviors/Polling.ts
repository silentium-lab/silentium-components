import {
  DestroyContainer,
  Message,
  MessageType,
  ResetSilenceCache,
} from "silentium";

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
    const dc = DestroyContainer();
    $trigger
      .then(() => {
        dc.destroy();
        r(ResetSilenceCache as T);
        dc.add($base.then(r).catch(reject));
      })
      .catch(reject);
  });
}
