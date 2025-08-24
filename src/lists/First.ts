import { Applied, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * Represents the first element of an array.
 */
export class First<T extends Array<unknown>> extends TheInformation<T[0]> {
  public constructor(private baseSrc: InformationType<T>) {
    super(baseSrc);
  }

  public value(o: OwnerType<T[0]>): this {
    new Applied(this.baseSrc, (a) => a[0]).value(o);
    return this;
  }
}
