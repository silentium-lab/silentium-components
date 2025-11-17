import { All, Message, MessageType, Of, Tap } from "silentium";

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatch(
  patternSrc: MessageType<string>,
  valueSrc: MessageType<string>,
  flagsSrc: MessageType<string> = Of(""),
) {
  return Message<string[]>(function () {
    All(patternSrc, valueSrc, flagsSrc).pipe(
      Tap(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        this.use(result ?? []);
      }),
    );
  });
}
