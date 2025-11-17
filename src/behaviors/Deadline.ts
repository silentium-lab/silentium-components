import {
  ActualMessage,
  Filtered,
  MaybeMessage,
  Message,
  MessageType,
  Shared,
  Tap,
  TapType,
} from "silentium";

/**
 * Will return an error via error transport if
 * time runs out from $timeout; if $base manages to
 * respond before $timeout then the value from base will be returned
 */
export function Deadline<T>(
  error: TapType<Error>,
  $base: MessageType<T>,
  _timeout: MaybeMessage<number>,
) {
  const $timeout = ActualMessage(_timeout);
  return Message<T>(function () {
    let timer: ReturnType<typeof setTimeout> | number = 0;
    const base = Shared($base, true);
    $timeout.pipe(
      Tap((timeout) => {
        if (timer) {
          clearTimeout(timer);
        }
        let timeoutReached = false;

        timer = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          error.use(new Error("Timeout reached in Deadline"));
        }, timeout);

        const f = Filtered(base, () => !timeoutReached);
        f.pipe(this);

        base.pipe(
          Tap(() => {
            timeoutReached = true;
          }),
        );
      }),
    );
  });
}
