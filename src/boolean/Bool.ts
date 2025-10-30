import { Applied, Event, EventType } from "silentium";

/**
 * Convert Any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export function Bool($base: EventType): EventType<boolean> {
  return Event((transport) => {
    Applied($base, Boolean).event(transport);
  });
}
