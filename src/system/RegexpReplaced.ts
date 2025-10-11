import { all, EventType, of } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export const regexpReplaced = (
  valueSrc: EventType<string>,
  patternSrc: EventType<string>,
  replaceValueSrc: EventType<string>,
  flagsSrc: EventType<string> = of(""),
): EventType<string> => {
  return (u) => {
    all(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc,
    )(([pattern, value, replaceValue, flags]) => {
      u(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
};
