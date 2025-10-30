import {
  All,
  Applied,
  EventType,
  Late,
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
  $base: EventType<T>,
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
    private $base: EventType<T>,
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

  public event(transport: TransportType<T>) {
    const $comparing = Applied(this.$comparing, this.cloner);
    All($comparing, this.$base).event(
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
              return value !== (base as any)[key];
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
