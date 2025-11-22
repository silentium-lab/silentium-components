import { isFilled, Message, MessageType } from "silentium";

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export function Memo<T>($base: MessageType<T>) {
  return Message<T>(function MemoImpl(r) {
    let last: T | null = null;
    $base.then((v) => {
      if (v !== last && isFilled(v)) {
        r(v);
        last = v;
      }
    });
  });
}
