import { Applied, EventType } from "silentium";

/**
 * Convert Any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export function Bool(baseSrc: EventType): EventType<boolean> {
  return (user) => {
    Applied(baseSrc, Boolean)(user);
  };
}
