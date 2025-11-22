import { Message, MessageType } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export function OnlyChanged<T>($base: MessageType<T>) {
  return Message<T>(function OnlyChangedImpl(r) {
    let first = false;
    $base.then((v) => {
      if (first === false) {
        first = true;
      } else {
        r(v);
      }
    });
  });
}
