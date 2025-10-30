import { Event, EventType, Transport } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export function Not($base: EventType<boolean>): EventType<boolean> {
  return Event((transport) => {
    $base.event(
      Transport((v) => {
        transport.use(!v);
      }),
    );
  });
}
