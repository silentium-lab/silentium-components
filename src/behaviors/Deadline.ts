import {
  Actual,
  Filtered,
  MaybeMessage,
  Message,
  MessageType,
  Shared,
} from "silentium";

/**
 * Will return an error via error transport if
 * time runs out from $timeout; if $base manages to
 * respond before $timeout then the value from base will be returned
 */
export function Deadline<T>(
  $base: MessageType<T>,
  _timeout: MaybeMessage<number>,
) {
  const $timeout = Actual(_timeout);
  return Message<T>(function DeadlineImpl(resolve, reject) {
    let timer: ReturnType<typeof setTimeout> | number = 0;
    const base = Shared($base);
    $timeout.then((timeout) => {
      if (timer) {
        clearTimeout(timer);
      }
      let timeoutReached = false;

      timer = setTimeout(() => {
        if (timeoutReached) {
          return;
        }
        timeoutReached = true;
        reject(new Error("Timeout reached in Deadline"));
      }, timeout);

      const f = Filtered(base, () => !timeoutReached);
      f.then(resolve);

      base.then(() => {
        timeoutReached = true;
      });
    });
  });
}
