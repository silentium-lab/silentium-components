import { Message, MessageType, Transport } from "silentium";

/**
 * Representation Of loading process
 * first message begins loading
 * second message stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export function Loading(
  $loadingStart: MessageType<unknown>,
  $loadingFinish: MessageType<unknown>,
) {
  return Message<boolean>((transport) => {
    $loadingStart.to(Transport(() => transport.use(true)));
    $loadingFinish.to(Transport(() => transport.use(false)));
  });
}
