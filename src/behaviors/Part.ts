import {
  Actual,
  All,
  isFilled,
  MaybeMessage,
  MessageSourceType,
  Primitive,
  Shared,
  Source,
} from "silentium";

/**
 * Return source Of record path
 * @url https://silentium.pw/article/part/view
 */
export function Part<
  R,
  T extends object | Array<any> = any,
  K extends string = any,
>(
  $base: MessageSourceType<T>,
  key: MaybeMessage<K>,
  defaultValue?: R,
): MessageSourceType<R> {
  const $baseShared = Shared($base);
  const $keyedShared = Shared(Actual(key));
  const keyPrimitive = Primitive($keyedShared);
  const base = Primitive($baseShared);
  return Source(
    function PartImpl(r) {
      All($baseShared, $keyedShared).then(function partAllSub([base, keyed]) {
        const keys = keyed.split(".");
        let value: unknown = base;
        keys.forEach(function partsAllKeysForEach(key: string) {
          value = (value as Record<string, unknown>)[key];
        });
        if (value !== undefined && value !== base) {
          r(value as R);
        } else if (defaultValue !== undefined) {
          r(defaultValue);
        }
      });
    },
    function PartSourceImpl(value) {
      if (isFilled(key)) {
        $base.use({
          ...base.primitiveWithException(),
          [keyPrimitive.primitiveWithException()]: value,
        } as T);
      }
    },
  );
}
