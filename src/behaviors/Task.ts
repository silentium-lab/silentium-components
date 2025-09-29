import { DataType, executorApplied } from "silentium";

export const task = <T>(
  baseSrc: DataType<T>,
  delay: number = 0,
): DataType<T> => {
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
