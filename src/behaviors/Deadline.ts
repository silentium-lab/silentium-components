import {
  Event,
  EventType,
  TransportType,
  Filtered,
  Shared,
  Transport,
} from "silentium";

export function Deadline<T>(
  error: TransportType<Error>,
  $base: EventType<T>,
  $timeout: EventType<number>,
): EventType<T> {
  return Event((transport) => {
    let timer: ReturnType<typeof setTimeout> | number = 0;
    const base = Shared($base, true);
    $timeout.event(
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
        f.event(transport);

        base.event(
          Transport(() => {
            timeoutReached = true;
          }),
        );
      }),
    );
  });
}
