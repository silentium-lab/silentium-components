import { All, From, Of, TheInformation, TheOwner } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export class RegexpReplaced extends TheInformation<string> {
  public constructor(
    private valueSrc: TheInformation<string>,
    private patternSrc: TheInformation<string>,
    private replaceValueSrc: TheInformation<string>,
    private flagsSrc: TheInformation<string> = new Of(""),
  ) {
    super(valueSrc, patternSrc, replaceValueSrc, flagsSrc);
  }

  public value(o: TheOwner<string>): this {
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
