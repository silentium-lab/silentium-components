import {
  All,
  Applied,
  DestroyableType,
  DestroyContainer,
  EventType,
  isDestroyable,
  Of,
  TransportType,
} from "silentium";
import { RecordOf } from "../structures";

export function Template(
  $src: EventType<string> = Of(""),
  $places: EventType<Record<string, unknown>> = Of({}),
) {
  return new TemplateEvent($src, $places);
}

class TemplateEvent implements EventType<string>, DestroyableType {
  private dc = DestroyContainer();
  private vars: Record<string, EventType> = {
    $TPL: Of("$TPL"),
  };

  public constructor(
    private $src: EventType<string> = Of(""),
    private $places: EventType<Record<string, unknown>> = Of({}),
  ) {}

  public event(transport: TransportType<string, null>): this {
    const $vars = RecordOf(this.vars);
    Applied(All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
      Object.entries(rules).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });
      Object.entries(vars).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });

      return base;
    }).event(transport);
    return this;
  }

  public template(value: string) {
    this.$src = Of(value);
  }

  /**
   * Ability to register variable
   * in concrete place Of template
   */
  public var(src: EventType<string>) {
    const places = Object.keys(this.vars).length;
    const varName = `$var${places}`;
    if (isDestroyable(src)) {
      this.dc.add(src);
    }
    this.vars[varName] = src;
    return varName;
  }

  public destroy(): this {
    this.dc.destroy();
    return this;
  }
}
