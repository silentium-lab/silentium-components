import { Filtered, Message, MessageType, Tap } from "silentium";

/**
 * Allows locking messages
 * if a $lock message arrives
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export function Lock<T>($base: MessageType<T>, $lock: MessageType<boolean>) {
  return Message<T>(function () {
    let locked = false;
    $lock.pipe(
      Tap((newLock) => {
        locked = newLock;
      }),
    );
    const i = Filtered($base, () => !locked);
    i.pipe(this);
  });
}
