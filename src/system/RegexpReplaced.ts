import { All, Message, MessageType, Of } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export function RegexpReplaced(
  valueSrc: MessageType<string>,
  patternSrc: MessageType<string>,
  replaceValueSrc: MessageType<string>,
  flagsSrc: MessageType<string> = Of(""),
) {
  return Message<string>(function RegexpReplacedImpl(r) {
    All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).then(
      ([pattern, value, replaceValue, flags]) => {
        r(String(value).replace(new RegExp(pattern, flags), replaceValue));
      },
    );
  });
}
