import { All, Message, MessageType, Of, Tap } from "silentium";

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
  return Message<string>(function () {
    All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).pipe(
      Tap(([pattern, value, replaceValue, flags]) => {
        this.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue),
        );
      }),
    );
  });
}
