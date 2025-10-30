import { Event, EventType, Transport } from "silentium";

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export function Memo<T>($base: EventType<T>): EventType<T> {
  return Event((transport) => {
    let last: T | null = null;
    $base.event(
      Transport((v) => {
        if (v !== last) {
          transport.use(v);
          last = v;
        }
      }),
    );
  });
}
