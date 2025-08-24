import { From, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export class Memo<T> extends TheInformation<T> {
  public constructor(private baseSrc: InformationType<T>) {
    super(baseSrc);
  }

  public value(o: OwnerType<T>): this {
    let lastValue: T | null = null;

    this.baseSrc.value(
      new From((v) => {
        if (v !== lastValue) {
          o.give(v);
          lastValue = v;
        }
      }),
    );

    return this;
  }
}
