import { EventType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export const not = (baseSrc: EventType<boolean>): EventType<boolean> => {
  return (u) => {
    baseSrc((v) => {
      u(!v);
    });
  };
};
