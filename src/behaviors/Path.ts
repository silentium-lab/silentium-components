import {
  ActualMessage,
  All,
  MaybeMessage,
  Message,
  MessageType,
  Tap,
} from "silentium";

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export function Path<
  R,
  T extends object | Array<any> = any,
  K extends string = any,
>($base: MessageType<T>, _keyed: MaybeMessage<K>) {
  const $keyed = ActualMessage(_keyed);
  return Message<R>(function () {
    All($base, $keyed).pipe(
      Tap(([base, keyed]) => {
        const keys = keyed.split(".");
        let value: unknown = base;
        keys.forEach((key) => {
          value = (value as Record<string, unknown>)[key];
        });
        if (value !== undefined && value !== base) {
          this.use(value as R);
        }
      }),
    );
  });
}
