import {
  Filtered,
  Message,
  MessageType,
  Shared,
  Transport,
  TransportType,
} from "silentium";

/**
 * Will return an error via error transport if
 * time runs out from $timeout; if $base manages to
 * respond before $timeout then the value from base will be returned
 */
export function Deadline<T>(
  error: TransportType<Error>,
  $base: MessageType<T>,
  $timeout: MessageType<number>,
) {
  return Message<T>((transport) => {
    let timer: ReturnType<typeof setTimeout> | number = 0;
    const base = Shared($base, true);
    $timeout.to(
      Transport((timeout) => {
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
        f.to(transport);

        base.to(
          Transport(() => {
            timeoutReached = true;
          }),
        );
      }),
    );
  });
}
