import { Event, EventType, Transport } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export function OnlyChanged<T>($base: EventType<T>): EventType<T> {
  return Event((transport) => {
    let first = false;
    $base.event(
      Transport((v) => {
        if (first === false) {
          first = true;
        } else {
          transport.use(v);
        }
      }),
    );
  });
}
