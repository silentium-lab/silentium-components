import { All, Event, EventType, Of, Transport } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export function RegexpReplaced(
  valueSrc: EventType<string>,
  patternSrc: EventType<string>,
  replaceValueSrc: EventType<string>,
  flagsSrc: EventType<string> = Of(""),
): EventType<string> {
  return Event((transport) => {
    All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).event(
      Transport(([pattern, value, replaceValue, flags]) => {
        transport.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue),
        );
      }),
    );
  });
}
