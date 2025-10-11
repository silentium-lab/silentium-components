import { EventType } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export const onlyChanged = <T>(baseSrc: EventType<T>): EventType<T> => {
  return (u) => {
    let firstValue = false;

    baseSrc((v) => {
      if (firstValue === false) {
        firstValue = true;
      } else {
        u(v);
      }
    });
  };
};
