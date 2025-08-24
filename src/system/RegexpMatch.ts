import {
  All,
  From,
  InformationType,
  Of,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export class RegexpMatch extends TheInformation<string[]> {
  public constructor(
    private patternSrc: InformationType<string>,
    private valueSrc: InformationType<string>,
    private flagsSrc: InformationType<string> = new Of(""),
  ) {
    super(patternSrc, valueSrc, flagsSrc);
  }

  public value(o: OwnerType<string[]>): this {
    new All(this.patternSrc, this.valueSrc, this.flagsSrc).value(
      new From(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        o.give(result ?? []);
      }),
    );
    return this;
  }
}
