import { Message, MessageType } from "silentium";

/**
 * Representation Of loading process
 * first message begins loading
 * second message stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export function Loading(
  $start: MessageType<unknown>,
  $finish: MessageType<unknown>,
) {
  return Message<boolean>(function LoadingImpl(r) {
    $start.then(function loadingStartSub() {
      r(true);
    });
    $finish.then(function loadingFinishSub() {
      r(false);
    });
  });
}
