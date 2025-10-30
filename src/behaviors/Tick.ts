import { Event, EventType, Transport } from "silentium";

/**
 * Accumulates the last value Of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
export function Tick<T>($base: EventType<T>): EventType<T> {
  return Event((transport) => {
    let microtaskScheduled = false;
    let lastValue: T | null = null;

    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          transport.use(lastValue);
          lastValue = null;
        }
      });
    };

    $base.event(
      Transport((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      }),
    );
  });
}
