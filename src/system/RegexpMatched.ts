import { All, EventType, Of } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatched = (
  patternSrc: EventType<string>,
  valueSrc: EventType<string>,
  flagsSrc: EventType<string> = Of(""),
): EventType<boolean> => {
  return (u) => {
    All(
      patternSrc,
      valueSrc,
      flagsSrc,
    )(([pattern, value, flags]) => {
      u(new RegExp(pattern, flags).test(value));
    });
  };
};
