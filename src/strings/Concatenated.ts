import { All, Event, EventType, Of, Transport } from "silentium";

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export function Concatenated(
  sources: EventType<string>[],
  joinPartSrc: EventType<string> = Of(""),
): EventType<string> {
  return Event((transport) => {
    All(joinPartSrc, ...sources).event(
      Transport(([joinPart, ...strings]) => {
        transport.use(strings.join(joinPart));
      }),
    );
  });
}
