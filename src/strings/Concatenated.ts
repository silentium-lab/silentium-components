import { All, EventType, Of } from "silentium";

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export function Concatenated(
  sources: EventType<string>[],
  joinPartSrc: EventType<string> = Of(""),
): EventType<string> {
  return (user) => {
    All(
      joinPartSrc,
      ...sources,
    )(([joinPart, ...strings]) => {
      user(strings.join(joinPart));
    });
  };
}
