import { EventType, executorApplied } from "silentium";

export const task = <T>(
  baseSrc: EventType<T>,
  delay: number = 0,
): EventType<T> => {
  return (u) => {
    let prevTimer: unknown | null = null;
    executorApplied(baseSrc, (fn) => {
      return (v) => {
        if (prevTimer) {
          clearTimeout(prevTimer as number);
        }
        prevTimer = setTimeout(() => {
          fn(v);
        }, delay);
      };
    })(u);
  };
};
