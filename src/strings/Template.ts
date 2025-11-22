import {
  All,
  Applied,
  ConstructorType,
  DestroyableType,
  DestroyContainer,
  isDestroyable,
  MessageType,
  Of,
  Rejections,
} from "silentium";

import { Record } from "../structures";

/**
 * Allows creating a string template with
 * variables inserted into it; when variables change,
 * the template value will change
 */
export function Template(
  $src: MessageType<string> = Of(""),
  $places: MessageType<Record<string, unknown>> = Of({}),
) {
  return new TemplateImpl($src, $places);
}

class TemplateImpl implements MessageType<string>, DestroyableType {
  private dc = DestroyContainer();
  private rejections = new Rejections();
  private vars: Record<string, MessageType> = {
    $TPL: Of("$TPL"),
  };

  public constructor(
    private $src: MessageType<string> = Of(""),
    private $places: MessageType<Record<string, unknown>> = Of({}),
  ) {}

  public then(transport: ConstructorType<[string]>): this {
    const $vars = Record(this.vars);
    Applied(All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
      try {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
      } catch (e) {
        this.rejections.reject(e);
      }

      return base;
    }).then(transport);
    return this;
  }

  public template(value: string) {
    this.$src = Of(value);
  }

  /**
   * Ability to register variable
   * in concrete place Of template
   */
  public var(src: MessageType<string>) {
    const places = Object.keys(this.vars).length;
    const varName = `$var${places}`;
    if (isDestroyable(src)) {
      this.dc.add(src);
    }
    this.vars[varName] = src;
    return varName;
  }

  public catch(rejected: ConstructorType<[unknown]>): this {
    this.rejections.catch(rejected);
    return this;
  }

  public destroy(): this {
    this.dc.destroy();
    return this;
  }
}
