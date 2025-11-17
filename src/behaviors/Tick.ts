import { Message, MessageType, Tap } from "silentium";

/**
 * Accumulates the last value Of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
export function Tick<T>($base: MessageType<T>) {
  return Message(function () {
    let microtaskScheduled = false;
    let lastValue: T | null = null;

    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          this.use(lastValue);
          lastValue = null;
        }
      });
    };

    $base.pipe(
      Tap((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      }),
    );
  });
}
