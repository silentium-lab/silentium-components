import { All, Message, MessageType, Of, Transport } from "silentium";

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export function Concatenated(
  sources: MessageType<string>[],
  joinPartSrc: MessageType<string> = Of(""),
) {
  return Message<string>((transport) => {
    All(joinPartSrc, ...sources).to(
      Transport(([joinPart, ...strings]) => {
        transport.use(strings.join(joinPart));
      }),
    );
  });
}
