import { All, From, Of, TheInformation, TheOwner } from "silentium";

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export class RegexpMatch extends TheInformation<string[]> {
  public constructor(
    private patternSrc: TheInformation<string>,
    private valueSrc: TheInformation<string>,
    private flagsSrc: TheInformation<string> = new Of(""),
  ) {
    super(patternSrc, valueSrc, flagsSrc);
  }

  public value(o: TheOwner<string[]>): this {
    new All(this.patternSrc, this.valueSrc, this.flagsSrc).value(
      new From(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        o.give(result ?? []);
      }),
    );
    return this;
  }
}
