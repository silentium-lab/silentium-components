import { From, InformationType, OwnerType, TheInformation } from "silentium";

export class Const<T> extends TheInformation<T> {
  public constructor(
    private permanentValue: T,
    private triggerSrc: InformationType,
  ) {
    super(triggerSrc);
  }

  public value(o: OwnerType<T>): this {
    this.triggerSrc.value(
      new From(() => {
        o.give(this.permanentValue);
      }),
    );
    return this;
  }
}
