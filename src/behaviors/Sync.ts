import { From, TheInformation, TheOwner } from "silentium";

export class Sync<T> extends TheInformation<T> {
  private theValue: T | undefined;
  private isInit = false;

  public constructor(private baseSrc: TheInformation<T>) {
    super([baseSrc]);
  }

  public value(o: TheOwner<T>): this {
    this.baseSrc.value(o);
    return this;
  }

  public valueSync(): T {
    if (!this.isInit) {
      this.isInit = true;
      this.value(
        new From((v) => {
          this.theValue = v;
        }),
      );
    }

    if (this.theValue === undefined) {
      throw new Error("no value in sync");
    }

    return this.theValue;
  }
}
