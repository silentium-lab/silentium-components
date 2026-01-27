import { Message, MessageType } from "silentium";

/**
 * Represents source what was changed at least once
 * @url https://silentium.pw/article/only-changed/view
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
