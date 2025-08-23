import { From, TheInformation, TheOwner } from "silentium";

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
export class Memo<T> extends TheInformation<T> {
  public constructor(private baseSrc: TheInformation<T>) {
    super(baseSrc);
  }

  public value(o: TheOwner<T>): this {
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
