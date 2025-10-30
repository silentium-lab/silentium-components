import { All, Event, EventType, Transport } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
export function And(
  $one: EventType<boolean>,
  $two: EventType<boolean>,
): EventType<boolean> {
  return Event((transport) => {
    All($one, $two).event(
      Transport(([one, two]) => {
        transport.use(one && two);
      }),
    );
  });
}
