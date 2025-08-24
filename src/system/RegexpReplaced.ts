import {
  All,
  From,
  InformationType,
  Of,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export class RegexpReplaced extends TheInformation<string> {
  public constructor(
    private valueSrc: InformationType<string>,
    private patternSrc: InformationType<string>,
    private replaceValueSrc: InformationType<string>,
    private flagsSrc: InformationType<string> = new Of(""),
  ) {
    super(valueSrc, patternSrc, replaceValueSrc, flagsSrc);
  }

  public value(o: OwnerType<string>): this {
    new All(
      this.patternSrc,
      this.valueSrc,
      this.replaceValueSrc,
      this.flagsSrc,
    ).value(
      new From(([pattern, value, replaceValue, flags]) => {
        o.give(String(value).replace(new RegExp(pattern, flags), replaceValue));
      }),
    );
    return this;
  }
}
