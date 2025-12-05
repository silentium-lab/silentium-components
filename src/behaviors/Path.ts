import {
  ActualMessage,
  All,
  Applied,
  MaybeMessage,
  MessageType,
} from "silentium";

const NotSet = Symbol("not-set");

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
  const $def = ActualMessage(def ?? NotSet);
  return Applied(All($base, $keyed, $def), ([base, keyed, d]) => {
    const keys = keyed.split(".");
    let value: unknown = base;
    keys.forEach((key) => {
      value = (value as Record<string, unknown>)[key];
    });
    if (value !== undefined && value !== base) {
      return value as R;
    } else if (d !== NotSet) {
      return d as R;
    }
  }) as MessageType<R>;
}
