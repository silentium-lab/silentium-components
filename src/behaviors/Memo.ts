import { EventType } from "silentium";

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export function Memo<T>(baseSrc: EventType<T>): EventType<T> {
  return (user) => {
    let lastValue: T | null = null;

    baseSrc((v) => {
      if (v !== lastValue) {
        user(v);
        lastValue = v;
      }
    });
  };
}
