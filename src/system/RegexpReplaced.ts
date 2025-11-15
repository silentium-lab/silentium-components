import { All, Message, MessageType, Of, Transport } from "silentium";

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
  return Message<string>((transport) => {
    All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).to(
      Transport(([pattern, value, replaceValue, flags]) => {
        transport.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue),
        );
      }),
    );
  });
}
