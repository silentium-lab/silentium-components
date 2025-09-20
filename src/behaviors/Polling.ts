import { From, InformationType, OwnerType, TheInformation } from "silentium";

export class Polling<T> extends TheInformation<T> {
  public constructor(
    private baseSrc: InformationType<T>,
    private triggerSrc: InformationType<T>,
  ) {
    super(baseSrc, triggerSrc);
  }

  public value(o: OwnerType<T>): this {
    this.triggerSrc.value(
      new From(() => {
        this.baseSrc.value(
          new From((v) => {
            o.give(v);
          }),
        );
      }),
    );
    return this;
  }
}
