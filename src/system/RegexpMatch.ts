import { Actual, All, MaybeMessage, Message, Of } from "silentium";

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatch(
  patternSrc: MaybeMessage<string>,
  valueSrc: MaybeMessage<string>,
  flagsSrc: MaybeMessage<string> = Of(""),
) {
  const $pattern = Actual(patternSrc);
  const $value = Actual(valueSrc);
  const $flags = Actual(flagsSrc);
  return Message<string[]>(function RegexpMatchImpl(r) {
    All($pattern, $value, $flags).then(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      r(result ?? []);
    });
  });
}
