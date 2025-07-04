import { all, I, Information, O } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatched = (
  patternSrc: Information<string>,
  valueSrc: Information<string>,
  flagsSrc: Information<string> = I(""),
): Information<boolean> =>
  I((o) => {
    all(patternSrc, valueSrc, flagsSrc).value(
      O(([pattern, value, flags]) => {
        o.give(new RegExp(pattern, flags).test(value));
      }),
    );
  });
