import {
  ActualMessage,
  All,
  Applied,
  ConstructorType,
  DestroyableType,
  DestroyContainer,
  isDestroyable,
  isMessage,
  LateShared,
  MaybeMessage,
  Message,
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
  src: MaybeMessage<string> | ((t: TemplateImpl) => string) = "",
  $places: MaybeMessage<Record<string, unknown>> = Of({}),
) {
  const $src = LateShared<string>();
  if (typeof src === "string" || isMessage(src)) {
    $src.chain(ActualMessage(src));
  }

  const t = new TemplateImpl(
    $src,
    $places ? ActualMessage($places) : undefined,
  );

  if (typeof src === "function") {
    $src.chain(
      Message((r) => {
        r(src(t));
      }),
    );
  }

  return t;
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
    const hash =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    const varName = `$var${hash}`;
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
