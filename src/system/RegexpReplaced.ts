import { all, I, Information, O } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export const regexpReplaced = (
  valueSrc: Information<string>,
  patternSrc: Information<string>,
  replaceValueSrc: Information<string>,
  flagsSrc: Information<string> = I(""),
): Information<string> =>
  I((o) => {
    all(patternSrc, valueSrc, replaceValueSrc, flagsSrc).value(
      O(([pattern, value, replaceValue, flags]) => {
        o.give(String(value).replace(new RegExp(pattern, flags), replaceValue));
      }),
    );
  });
