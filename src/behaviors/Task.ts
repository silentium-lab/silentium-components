import { Actual, ExecutorApplied, MaybeMessage, Message } from "silentium";

/**
 * Defer a message to the event loop
 * so that it executes once within
 * a certain timer firing interval
 *
 * @url https://silentium.pw/article/task/view
 */
export function Task<T>(baseSrc: MaybeMessage<T>, delay: number = 0) {
  const $base = Actual(baseSrc);
  return Message<T>(function TaskImpl(r) {
    let prevTimer: unknown | null = null;
    ExecutorApplied($base, (fn) => {
      return (v) => {
        if (prevTimer) {
          clearTimeout(prevTimer as number);
        }
        prevTimer = setTimeout(() => {
          fn(v);
        }, delay);
      };
    }).then(r);
  });
}
