import { Applied, TheInformation, TheOwner } from "silentium";

/**
 * Represents the first element of an array.
 */
export class First<T extends Array<unknown>> extends TheInformation<T[0]> {
  public constructor(private baseSrc: TheInformation<T>) {
    super(baseSrc);
  }

  public value(o: TheOwner<T[0]>): this {
    new Applied(this.baseSrc, (a) => a[0]).value(o);
    return this;
  }
}
