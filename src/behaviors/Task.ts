import { ExecutorApplied, Message, MessageType } from "silentium";

/**
 * Defer a message to the event loop
 * so that it executes once within
 * a certain timer firing interval
 */
export function Task<T>(baseSrc: MessageType<T>, delay: number = 0) {
  return Message<T>(function () {
    let prevTimer: unknown | null = null;
    ExecutorApplied(baseSrc, (fn) => {
      return (v) => {
        if (prevTimer) {
          clearTimeout(prevTimer as number);
        }
        prevTimer = setTimeout(() => {
          fn(v);
        }, delay);
      };
    }).pipe(this);
  });
}
