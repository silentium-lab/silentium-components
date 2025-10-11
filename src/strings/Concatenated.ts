import { all, EventType, of } from "silentium";

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export const concatenated = (
  sources: EventType<string>[],
  joinPartSrc: EventType<string> = of(""),
): EventType<string> => {
  return (u) => {
    all(
      joinPartSrc,
      ...sources,
    )(([joinPart, ...strings]) => {
      u(strings.join(joinPart));
    });
  };
};
