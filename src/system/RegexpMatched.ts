import {
  All,
  From,
  InformationType,
  Of,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export class RegexpMatched extends TheInformation<boolean> {
  public constructor(
    private patternSrc: InformationType<string>,
    private valueSrc: InformationType<string>,
    private flagsSrc: InformationType<string> = new Of(""),
  ) {
    super(patternSrc, valueSrc, flagsSrc);
  }

  public value(o: OwnerType<boolean>): this {
    new All(this.patternSrc, this.valueSrc, this.flagsSrc).value(
      new From(([pattern, value, flags]) => {
        o.give(new RegExp(pattern, flags).test(value));
      }),
    );
    return this;
  }
}
