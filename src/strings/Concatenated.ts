import { All, Message, MessageType, Of, Tap } from "silentium";

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export function Concatenated(
  sources: MessageType<string>[],
  joinPartSrc: MessageType<string> = Of(""),
) {
  return Message<string>(function () {
    All(joinPartSrc, ...sources).pipe(
      Tap(([joinPart, ...strings]) => {
        this.use(strings.join(joinPart));
      }),
    );
  });
}
