import {
  All,
  Applied,
  InformationType,
  Of,
  OwnerType,
  TheInformation,
} from "silentium";
import { RecordOf } from "../structures";

export class Template extends TheInformation<string> {
  private source: InformationType<string>;
  private placesCounter = 0;
  private vars: Record<string, InformationType> = {
    $TPL: new Of("$TPL"),
  };

  public constructor(
    theSrc: InformationType<string> | string = "",
    private placesSrc: InformationType<Record<string, unknown>> = new Of({}),
  ) {
    const source = typeof theSrc === "string" ? new Of(theSrc) : theSrc;
    super(source, placesSrc);
    this.source = source;
  }

  public value(guest: OwnerType<string>) {
    const varsSrc = new RecordOf(this.vars);
    new Applied(
      new All(this.source, this.placesSrc, varsSrc),
      ([base, rules, vars]) => {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });

        return base;
      },
    ).value(guest);
    return this;
  }

  public template(value: string) {
    this.source = new Of(value);
    this.addDep(this.source);
    return this;
  }

  /**
   * Ability to register variable
   * in concrete place of template
   */
  public var(src: InformationType<string>) {
    this.addDep(src);
    const varName = `$var${this.placesCounter}`;
    this.placesCounter += 1;
    this.vars[varName] = src;
    return varName;
  }
}
