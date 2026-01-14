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
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
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
  return Source(
    function PartImpl(r) {
      All($baseShared, $keyedShared).then(([base, keyed]) => {
        const keys = keyed.split(".");
        let value: unknown = base;
        keys.forEach((key: string) => {
          value = (value as Record<string, unknown>)[key];
        });
        if (value !== undefined && value !== base) {
          r(value as R);
        } else if (defaultValue !== undefined) {
          r(defaultValue);
        }
      });
    },
    (value) => {
      const key = Primitive($keyedShared);
      if (isFilled(key)) {
        const base = Primitive($base);
        $base.use({
          ...base.primitiveWithException(),
          [key.primitiveWithException()]: value,
        } as T);
      }
    },
  );
}
