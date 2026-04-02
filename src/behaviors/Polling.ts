import { DestroyContainer, Message, MessageType } from "silentium";

/**
 * Active polling of $base message
 * synchronized with $trigger message
 * can return same values
 */
export function Polling<T>(
  $base: MessageType<T>,
  $trigger: MessageType<unknown>,
) {
  return Message<T>(function PollingImpl(resolve, reject) {
    const dc = DestroyContainer();
    const pollingDc = DestroyContainer();
    pollingDc.add(dc);
    pollingDc.add(
      $trigger
        .then(function pollingTriggerSub() {
          dc.destroy();
          dc.add(
            $base
              .then(function pollingBaseSub(v) {
                resolve(v);
              })
              .catch(reject),
          );
        })
        .catch(reject),
    );
    return pollingDc.destructor();
  });
}
