import { LateShared, MessageType } from "silentium";

/**
 * Есть объект и каждое новое его значение нужно мержить с прошлым
 * чтобы накопить общие изменения
 */
export function MergeAccumulation<T extends object>(
  $base: MessageType<T>,
  $reset?: MessageType<T>,
): MessageType<T> {
  const accumulation = LateShared<T>();
  const lastAccumulated = {};
  $base.then((nextValue) => {
    accumulation.use(
      mergeWith(lastAccumulated, nextValue, (value1: any, value2: any) => {
        if (Array.isArray(value1)) {
          return value1.concat(value2);
        }
      }),
    );
  });

  if ($reset) {
    $reset.then((resetValue) => {
      accumulation.use(resetValue);
    });
  }

  return accumulation;
}

function mergeWith<TObject, TSource>(
  target: TObject,
  source: TSource,
  customizer: (
    objValue: any,
    srcValue: any,
    key: string,
    object: any,
    source: any,
  ) => any,
): TObject & TSource {
  if (source == null) {
    return target as TObject & TSource;
  }

  Object.keys(source).forEach((key) => {
    const srcValue = (source as any)[key];
    const objValue = (target as any)[key];
    const result = customizer(objValue, srcValue, key, target, source);

    if (result !== undefined) {
      (target as any)[key] = result;
    } else if (isObject(srcValue) && isObject(objValue)) {
      mergeWith(objValue, srcValue, customizer);
    } else {
      (target as any)[key] = srcValue;
    }
  });

  return target as TObject & TSource;
}

function isObject(value: any): value is "object" {
  return value != null && typeof value === "object";
}
