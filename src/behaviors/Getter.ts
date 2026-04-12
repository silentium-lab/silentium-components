import { Actual, All, Applied, MaybeMessage, MessageType } from "silentium";

const NotSet = Symbol("not-set");

export function Getter<R, T extends object = any, K extends string = any>(
  _base: MaybeMessage<T>,
  _method: MaybeMessage<K>,
  def?: MaybeMessage<R>,
) {
  const $base = Actual(_base);
  const $method = Actual(_method);
  const $def = Actual((def as any) ?? NotSet);
  return Applied(
    All($base, $method, $def),
    function GetterImpl([base, method, d]) {
      const value: any = base[method as unknown as keyof typeof base];
      if (value !== undefined && typeof value === "function") {
        return value.call(base) as R;
      } else if (d !== NotSet) {
        return d as R;
      }
    },
  ) as MessageType<R>;
}
