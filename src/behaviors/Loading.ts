import { Event, EventType, Transport } from "silentium";

/**
 * Representation Of loading process
 * first event begins loading
 * second event stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export function Loading(
  $loadingStart: EventType<unknown>,
  $loadingFinish: EventType<unknown>,
): EventType<boolean> {
  return Event((transport) => {
    $loadingStart.event(Transport(() => transport.use(true)));
    $loadingFinish.event(Transport(() => transport.use(false)));
  });
}
