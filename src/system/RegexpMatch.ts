import { ActualMessage, All, MaybeMessage, Message, Of } from "silentium";

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatch(
  patternSrc: MaybeMessage<string>,
  valueSrc: MaybeMessage<string>,
  flagsSrc: MaybeMessage<string> = Of(""),
) {
  const $pattern = ActualMessage(patternSrc);
  const $value = ActualMessage(valueSrc);
  const $flags = ActualMessage(flagsSrc);
  return Message<string[]>(function RegexpMatchImpl(r) {
    All($pattern, $value, $flags).then(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      r(result ?? []);
    });
  });
}
