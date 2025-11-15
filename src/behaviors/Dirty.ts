import {
  All,
  Applied,
  Late,
  MessageType,
  SourceType,
  Transport,
  TransportType,
} from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export function Dirty<T>(
  $base: MessageType<T>,
  keep: string[] = [],
  exclude: string[] = [],
  cloner?: (v: T) => T,
): SourceType<T> {
  return new DirtySource($base, keep, exclude, cloner);
}

class DirtySource<T> implements SourceType<T> {
  private $comparing = Late<T>();
  private cloner: (v: T) => T;

  public constructor(
    private $base: MessageType<T>,
    private keep: string[] = [],
    private exclude: string[] = [],
    cloner?: (v: T) => T,
  ) {
    if (cloner === undefined) {
      this.cloner = (value) => JSON.parse(JSON.stringify(value));
    } else {
      this.cloner = cloner;
    }
  }

  public to(transport: TransportType<T>) {
    const $comparing = Applied(this.$comparing, this.cloner);
    All($comparing, this.$base).to(
      Transport(([comparing, base]) => {
        if (!comparing) {
          return;
        }
        transport.use(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value]) => {
              if (this.keep.includes(key)) {
                return true;
              }
              if (this.exclude.includes(key)) {
                return false;
              }
              return value !== (base as Record<string, unknown>)[key];
            }),
          ) as T,
        );
      }),
    );
    return this;
  }

  public use(v: T) {
    this.$comparing.use(v);
    return this;
  }
}
