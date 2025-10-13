import { All, EventType, Of } from "silentium";

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatch = (
  patternSrc: EventType<string>,
  valueSrc: EventType<string>,
  flagsSrc: EventType<string> = Of(""),
): EventType<string[]> => {
  return (u) => {
    All(
      patternSrc,
      valueSrc,
      flagsSrc,
    )(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      u(result ?? []);
    });
  };
};
