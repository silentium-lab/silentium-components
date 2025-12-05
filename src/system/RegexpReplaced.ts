import { ActualMessage, All, Applied, MaybeMessage } from "silentium";

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
  const $value = ActualMessage(valueSrc);
  const $pattern = ActualMessage(patternSrc);
  const $replaceValue = ActualMessage(replaceValueSrc);
  const $flags = ActualMessage(flagsSrc);
  return Applied(
    All($pattern, $value, $replaceValue, $flags),
    ([pattern, value, replaceValue, flags]) => {
      return String(value).replace(new RegExp(pattern, flags), replaceValue);
    },
  );
}
