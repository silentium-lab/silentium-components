import { All, Message, MessageType, Of, Transport } from "silentium";

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export function RegexpMatch(
  patternSrc: MessageType<string>,
  valueSrc: MessageType<string>,
  flagsSrc: MessageType<string> = Of(""),
) {
  return Message<string[]>((transport) => {
    All(patternSrc, valueSrc, flagsSrc).to(
      Transport(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        transport.use(result ?? []);
      }),
    );
  });
}
