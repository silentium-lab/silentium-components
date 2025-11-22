import { Filtered, Message, MessageType } from "silentium";

/**
 * Allows locking messages
 * if a $lock message arrives
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export function Lock<T>($base: MessageType<T>, $lock: MessageType<boolean>) {
  return Message<T>(function LockImpl(r) {
    let locked = false;
    $lock.then((newLock) => {
      locked = newLock;
    });
    const i = Filtered($base, () => !locked);
    i.then(r);
  });
}
