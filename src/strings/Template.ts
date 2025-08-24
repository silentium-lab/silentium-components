import {
  All,
  Applied,
  InformationType,
  Of,
  OwnerType,
  TheInformation,
} from "silentium";

export class Template extends TheInformation<string> {
  private source: InformationType<string>;

  public constructor(
    theSrc: InformationType<string> | string,
    private rules: InformationType<Record<string, unknown>>,
  ) {
    const source = typeof theSrc === "string" ? new Of(theSrc) : theSrc;
    super(source, rules);
    this.source = source;
  }

  public value(guest: OwnerType<string>) {
    new Applied(new All(this.source, this.rules), ([base, rules]) => {
      Object.entries(rules).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });

      return base;
    }).value(guest);
    return this;
  }
}
