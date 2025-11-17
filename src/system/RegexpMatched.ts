import { All, Message, MessageType, Of, Tap } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatched(
  patternSrc: MessageType<string>,
  valueSrc: MessageType<string>,
  flagsSrc: MessageType<string> = Of(""),
) {
  return Message<boolean>(function () {
    All(patternSrc, valueSrc, flagsSrc).pipe(
      Tap(([pattern, value, flags]) => {
        this.use(new RegExp(pattern, flags).test(value));
      }),
    );
  });
}
