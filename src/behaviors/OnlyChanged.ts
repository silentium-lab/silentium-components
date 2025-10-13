import { EventType } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export function OnlyChanged<T>(baseSrc: EventType<T>): EventType<T> {
  return (user) => {
    let firstValue = false;

    baseSrc((v) => {
      if (firstValue === false) {
        firstValue = true;
      } else {
        user(v);
      }
    });
  };
}
