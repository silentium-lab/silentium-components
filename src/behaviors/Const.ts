import { Event, EventType, Transport } from "silentium";

export function Constant<T>(permanent: T, $trigger: EventType): EventType<T> {
  return Event((transport) => {
    $trigger.event(
      Transport(() => {
        transport.use(permanent);
      }),
    );
  });
}
