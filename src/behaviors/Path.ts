import {
  ActualMessage,
  All,
  MaybeMessage,
  Message,
  MessageType,
} from "silentium";

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export function Path<
  R,
  T extends object | Array<any> = any,
  K extends string = any,
>($base: MessageType<T>, _keyed: MaybeMessage<K>, def?: MaybeMessage<T>) {
  const $keyed = ActualMessage(_keyed);
  const $def = ActualMessage(def);
  return Message<R>(function PathImpl(r) {
    All($base, $keyed, $def).then(([base, keyed, d]) => {
      const keys = keyed.split(".");
      let value: unknown = base;
      keys.forEach((key) => {
        value = (value as Record<string, unknown>)[key];
      });
      if (value !== undefined && value !== base) {
        r(value as R);
      } else if (d !== undefined) {
        r(d as R);
      }
    });
  });
}
