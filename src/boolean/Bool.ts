import { applied, EventType } from "silentium";

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export const bool = (baseSrc: EventType): EventType<boolean> => {
  return (u) => {
    applied(baseSrc, Boolean)(u);
  };
};
