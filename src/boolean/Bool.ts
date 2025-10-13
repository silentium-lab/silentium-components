import { Applied, EventType } from "silentium";

/**
 * Convert Any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export const bool = (baseSrc: EventType): EventType<boolean> => {
  return (u) => {
    Applied(baseSrc, Boolean)(u);
  };
};
