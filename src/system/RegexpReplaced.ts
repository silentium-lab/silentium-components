import { Actual, All, Applied, MaybeMessage } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export function RegexpReplaced(
  valueSrc: MaybeMessage<string>,
  patternSrc: MaybeMessage<string>,
  replaceValueSrc: MaybeMessage<string>,
  flagsSrc: MaybeMessage<string> = "",
) {
  const $value = Actual(valueSrc);
  const $pattern = Actual(patternSrc);
  const $replaceValue = Actual(replaceValueSrc);
  const $flags = Actual(flagsSrc);
  return Applied(
    All($pattern, $value, $replaceValue, $flags),
    ([pattern, value, replaceValue, flags]) => {
      return String(value).replace(new RegExp(pattern, flags), replaceValue);
    },
  );
}
