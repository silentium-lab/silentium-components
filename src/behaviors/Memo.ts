import { isFilled, Message, MessageType, Tap } from "silentium";

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export function Memo<T>($base: MessageType<T>) {
  return Message<T>(function () {
    let last: T | null = null;
    $base.pipe(
      Tap((v) => {
        if (v !== last && isFilled(v)) {
          this.use(v);
          last = v;
        }
      }),
    );
  });
}
