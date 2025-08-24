import { Applied, TheInformation, TheOwner } from "silentium";

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export class Bool extends TheInformation<boolean> {
  public constructor(private baseSrc: TheInformation) {
    super(baseSrc);
  }

  public value(o: TheOwner<boolean>): this {
    new Applied(this.baseSrc, Boolean).value(o);
    return this;
  }
}
