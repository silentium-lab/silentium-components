import { Message, MessageType, Tap } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export function OnlyChanged<T>($base: MessageType<T>) {
  return Message<T>(function () {
    let first = false;
    $base.pipe(
      Tap((v) => {
        if (first === false) {
          first = true;
        } else {
          this.use(v);
        }
      }),
    );
  });
}
