import { All, Message, MessageType, Of, Transport } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatched(
  patternSrc: MessageType<string>,
  valueSrc: MessageType<string>,
  flagsSrc: MessageType<string> = Of(""),
) {
  return Message<boolean>((transport) => {
    All(patternSrc, valueSrc, flagsSrc).to(
      Transport(([pattern, value, flags]) => {
        transport.use(new RegExp(pattern, flags).test(value));
      }),
    );
  });
}
