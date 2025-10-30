import {
  All,
  EventType,
  isFilled,
  Primitive,
  Shared,
  SharedSource,
  SourceType,
  Transport,
  TransportType,
} from "silentium";

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export function Part<
  R,
  T extends object | Array<any> = any,
  K extends string = any,
>($base: SourceType<T>, $key: EventType<K>): SourceType<R> {
  return new PartEvent($base, $key);
}

class PartEvent<R, T extends object | Array<any>, K extends string = any>
  implements SourceType<R>
{
  private $base: SourceType<T>;
  private $key: EventType<K>;

  public constructor($base: SourceType<T>, $key: EventType<K>) {
    this.$base = SharedSource($base);
    this.$key = Shared($key);
  }

  public event(transport: TransportType<R, null>): this {
    All(this.$base, this.$key).event(
      Transport(([base, key]) => {
        const chunks = key.split(".");
        let value: unknown = base;
        chunks.forEach((chunk) => {
          value = (value as Record<string, unknown>)[chunk];
        });
        if (value !== undefined && value !== base) {
          transport.use(value as R);
        }
      }),
    );
    return this;
  }

  public use(value: R): this {
    const key = Primitive(this.$key);
    if (isFilled(key)) {
      const base = Primitive(this.$base);
      this.$base.use({
        ...base.primitiveWithException(),
        [key.primitiveWithException()]: value,
      } as T);
    }
    return this;
  }
}
