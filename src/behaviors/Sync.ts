import {
  From,
  InformationType,
  isFilled,
  OwnerType,
  TheInformation,
} from "silentium";

export class Sync<T> extends TheInformation<T> {
  private theValue: T | undefined;
  private isInit = false;

  public constructor(private baseSrc: InformationType<T>) {
    super(baseSrc);
  }

  public value(o: OwnerType<T>): this {
    this.baseSrc.value(o);
    return this;
  }

  public valueExisted() {
    this.initOwner();
    return isFilled(this.theValue);
  }

  public valueSync(): T {
    this.initOwner();

    if (!isFilled(this.theValue)) {
      throw new Error("no value in sync");
    }

    return this.theValue;
  }

  public initOwner() {
    if (!this.isInit) {
      this.isInit = true;
      this.value(
        new From((v) => {
          this.theValue = v;
        }),
      );
    }
    return this;
  }
}
