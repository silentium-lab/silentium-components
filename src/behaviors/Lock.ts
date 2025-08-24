import {
  Filtered,
  From,
  InformationType,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
export class Lock<T> extends TheInformation<T> {
  public constructor(
    private baseSrc: InformationType<T>,
    private lockSrc: InformationType<boolean>,
  ) {
    super(baseSrc, lockSrc);
  }

  public value(o: OwnerType<T>): this {
    let locked = false;
    this.lockSrc.value(
      new From((newLock) => {
        locked = newLock;
      }),
    );
    const i = new Filtered(this.baseSrc, () => !locked);
    this.addDep(i);
    i.value(o);
    return this;
  }
}
