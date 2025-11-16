import {
  ActualMessage,
  All,
  isFilled,
  MaybeMessage,
  MessageType,
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
>($base: SourceType<T>, $key: MaybeMessage<K>): SourceType<R> {
  return new PartImpl($base, ActualMessage($key));
}

class PartImpl<R, T extends object | Array<any>, K extends string = any>
  implements SourceType<R>
{
  private $base: SourceType<T>;
  private $keyed: MessageType<K>;

  public constructor($base: SourceType<T>, $key: MessageType<K>) {
    this.$base = SharedSource($base);
    this.$keyed = Shared($key);
  }

  public to(transport: TransportType<R, null>): this {
    All(this.$base, this.$keyed).to(
      Transport(([base, keyed]) => {
        const keys = keyed.split(".");
        let value: unknown = base;
        keys.forEach((key) => {
          value = (value as Record<string, unknown>)[key];
        });
        if (value !== undefined && value !== base) {
          transport.use(value as R);
        }
      }),
    );
    return this;
  }

  public use(value: R): this {
    const key = Primitive(this.$keyed);
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
