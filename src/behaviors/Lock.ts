import { Filtered, Message, MessageType, Transport } from "silentium";

/**
 * Allows locking messages
 * if a $lock message arrives
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export function Lock<T>($base: MessageType<T>, $lock: MessageType<boolean>) {
  return Message<T>((transport) => {
    let locked = false;
    $lock.to(
      Transport((newLock) => {
        locked = newLock;
      }),
    );
    const i = Filtered($base, () => !locked);
    i.to(transport);
  });
}
