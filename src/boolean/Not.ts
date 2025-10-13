import { EventType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export function Not(baseSrc: EventType<boolean>): EventType<boolean> {
  return (user) => {
    baseSrc((v) => {
      user(!v);
    });
  };
}
