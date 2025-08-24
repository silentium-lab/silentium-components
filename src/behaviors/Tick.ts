import { From, TheInformation, TheOwner } from "silentium";

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
export class Tick<T> extends TheInformation<T> {
  public constructor(private baseSrc: TheInformation<T>) {
    super(baseSrc);
  }

  public value(o: TheOwner<T>): this {
    let microtaskScheduled = false;
    let lastValue: T | null = null;

    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          o.give(lastValue);
          lastValue = null;
        }
      });
    };

    this.baseSrc.value(
      new From((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      }),
    );

    return this;
  }
}
