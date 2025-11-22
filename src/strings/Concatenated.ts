import { All, Message, MessageType, Of } from "silentium";

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export function Concatenated(
  sources: MessageType<string>[],
  joinPartSrc: MessageType<string> = Of(""),
) {
  return Message<string>(function ConcatenatedImpl(r) {
    All(joinPartSrc, ...sources).then(([joinPart, ...strings]) => {
      r(strings.join(joinPart));
    });
  });
}
