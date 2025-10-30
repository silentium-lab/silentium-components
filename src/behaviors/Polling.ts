import { Event, EventType, Transport } from "silentium";

export function Polling<T>(
  $base: EventType<T>,
  $trigger: EventType<T>,
): EventType<T> {
  return Event((transport) => {
    $trigger.event(
      Transport(() => {
        $base.event(transport);
      }),
    );
  });
}
