import { all, EventType, of } from "silentium";

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatch = (
  patternSrc: EventType<string>,
  valueSrc: EventType<string>,
  flagsSrc: EventType<string> = of(""),
): EventType<string[]> => {
  return (u) => {
    all(
      patternSrc,
      valueSrc,
      flagsSrc,
    )(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      u(result ?? []);
    });
  };
};
