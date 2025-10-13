import { All, EventType, Of } from "silentium";

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export const concatenated = (
  sources: EventType<string>[],
  joinPartSrc: EventType<string> = Of(""),
): EventType<string> => {
  return (u) => {
    All(
      joinPartSrc,
      ...sources,
    )(([joinPart, ...strings]) => {
      u(strings.join(joinPart));
    });
  };
};
