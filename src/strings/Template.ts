import {
  Actual,
  All,
  Applied,
  ConstructorType,
  DestroyableType,
  DestroyContainer,
  isDestroyable,
  isMessage,
  Late,
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
  const $src = Late<string>();
  if (typeof src === "string" || isMessage(src)) {
    $src.chain(Actual(src));
  }

  const t = new TemplateImpl($src, $places ? Actual($places) : undefined);

  if (typeof src === "function") {
    $src.chain(
      Message((r) => {
        r(src(t));
      }),
    );
  }

  return t;
}

export class TemplateImpl implements MessageType<string>, DestroyableType {
  private dc = DestroyContainer();
  private rejections = new Rejections();
  private vars: Record<string, MessageType> = {
    $TPL: Of("$TPL"),
  };

  public constructor(
    private $src: MessageType<string> = Of(""),
    private $places: MessageType<Record<string, unknown>> = Of({}),
    private escapeFn = escaped,
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
   * Register raw unsafe variable
   */
  public raw(src: MessageType<unknown>) {
    const hash =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    const varName = `$var${hash}`;
    if (isDestroyable(src)) {
      this.dc.add(src);
    }
    this.vars[varName] = src;
    return varName;
  }

  /**
   * Register variable what will be safe in HTML by default
   * or with your custom escape logic
   */
  public escaped(src: MessageType<any>) {
    if (isDestroyable(src)) {
      this.dc.add(src);
    }
    return this.raw(Applied(src, this.escapeFn));
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

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
} as const;

/**
 * String with html escaped
 */
export function escaped(base: string) {
  if (typeof base !== "string") {
    base = String(base);
  }
  return base.replace(
    /[&<>"'/]/g,
    (match) => escapeMap[match as keyof typeof escapeMap],
  );
}
