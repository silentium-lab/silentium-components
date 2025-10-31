import { All, Event, EventType, Of, Transport } from "silentium";

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatch(
  patternSrc: EventType<string>,
  valueSrc: EventType<string>,
  flagsSrc: EventType<string> = Of(""),
): EventType<string[]> {
  return Event((transport) => {
    All(patternSrc, valueSrc, flagsSrc).event(
      Transport(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        transport.use(result ?? []);
      }),
    );
  });
}
