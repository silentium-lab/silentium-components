import {
  All,
  From,
  InformationType,
  Of,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export class Concatenated extends TheInformation<string> {
  public constructor(
    private sources: InformationType<string>[],
    private joinPartSrc: InformationType<string> = new Of(""),
  ) {
    super(...sources, joinPartSrc);
  }

  public value(o: OwnerType<string>): this {
    new All(this.joinPartSrc, ...this.sources).value(
      new From(([joinPart, ...strings]) => {
        o.give(strings.join(joinPart));
      }),
    );
    return this;
  }
}
