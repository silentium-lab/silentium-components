import {
  ExecutorApplied,
  InformationType,
  OwnerType,
  TheInformation,
} from "silentium";

export class Task<T> extends TheInformation<T> {
  public constructor(
    private baseSrc: InformationType<T>,
    private delay: number = 0,
  ) {
    super(baseSrc);
  }

  public value(o: OwnerType<T>) {
    let prevTimer: unknown | null = null;
    new ExecutorApplied(this.baseSrc, (fn) => {
      return (v) => {
        if (prevTimer) {
          clearTimeout(prevTimer as number);
        }
        prevTimer = setTimeout(() => {
          fn(v);
        }, this.delay);
      };
    }).value(o);
    return this;
  }
}
