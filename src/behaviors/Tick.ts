import { Message, MessageType } from "silentium";

/**
 * Accumulates the last value Of the source and returns one result once per tick
 *
 * @url https://silentium.pw/article/tick/view
 */
export function Tick<T>($base: MessageType<T>) {
  return Message<T>(function TickImpl(r) {
    let microtaskScheduled = false;
    let lastValue: T | null = null;

    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          r(lastValue);
          lastValue = null;
        }
      });
    };

    $base.then((v) => {
      lastValue = v;
      if (!microtaskScheduled) {
        scheduleMicrotask();
      }
    });
  });
}
