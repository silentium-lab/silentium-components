import { Applied, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export class Bool extends TheInformation<boolean> {
  public constructor(private baseSrc: InformationType) {
    super(baseSrc);
  }

  public value(o: OwnerType<boolean>): this {
    new Applied(this.baseSrc, Boolean).value(o);
    return this;
  }
}
