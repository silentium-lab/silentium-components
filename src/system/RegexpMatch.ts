import { all, I, Information, O } from "silentium";

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatch = (
  patternSrc: Information<string>,
  valueSrc: Information<string>,
  flagsSrc: Information<string> = I(""),
): Information<string[]> =>
  I((o) => {
    all(patternSrc, valueSrc, flagsSrc).value(
      O(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        o.give(result ?? []);
      }),
    );
  });
