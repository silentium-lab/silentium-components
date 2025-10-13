import { EventType, ExecutorApplied } from "silentium";

export function Task<T>(
  baseSrc: EventType<T>,
  delay: number = 0,
): EventType<T> {
  return (user) => {
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
    })(user);
  };
}
