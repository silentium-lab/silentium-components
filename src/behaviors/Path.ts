import {
  Actual,
  All,
  Applied,
  Empty,
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
>(_base: MaybeMessage<T>, _keyed: MaybeMessage<K>, def?: MaybeMessage<R>) {
  const $base = Actual(_base);
  const $keyed = Actual(_keyed);
  const $def = Actual((def as any) ?? NotSet);
  return Empty(
    Applied(All($base, $keyed, $def), ([base, keyed, d]) => {
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
    }),
  ) as MessageType<R>;
}
