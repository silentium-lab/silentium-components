import { ActualMessage, All, MaybeMessage, Message, Of } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatched(
  patternSrc: MaybeMessage<string>,
  valueSrc: MaybeMessage<string>,
  flagsSrc: MaybeMessage<string> = Of(""),
) {
  const $pattern = ActualMessage(patternSrc);
  const $value = ActualMessage(valueSrc);
  const $flags = ActualMessage(flagsSrc);
  return Message<boolean>(function RegexpMatchedImpl(r) {
    All($pattern, $value, $flags).then(([pattern, value, flags]) => {
      r(new RegExp(pattern, flags).test(value));
    });
  });
}
