import { All, EventType, Of } from "silentium";

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
  return (user) => {
    All(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc,
    )(([pattern, value, replaceValue, flags]) => {
      user(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
}
