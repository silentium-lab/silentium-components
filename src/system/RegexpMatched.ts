import { All, Event, EventType, Of, Transport } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatched(
  patternSrc: EventType<string>,
  valueSrc: EventType<string>,
  flagsSrc: EventType<string> = Of(""),
): EventType<boolean> {
  return Event((transport) => {
    All(patternSrc, valueSrc, flagsSrc).event(
      Transport(([pattern, value, flags]) => {
        transport.use(new RegExp(pattern, flags).test(value));
      }),
    );
  });
}
