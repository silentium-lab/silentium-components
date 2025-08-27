import {
  Any,
  Chain,
  From,
  InformationType,
  Of,
  OwnerType,
  TheInformation,
  TheOwner,
} from "silentium";
import { Branch } from "../behaviors";
import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: T | InformationType<T>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export class Router<T = "string"> extends TheInformation<T> {
  public constructor(
    private urlSrc: InformationType<string>,
    private routesSrc: InformationType<Route<T>[]>,
    private defaultSrc: InformationType<T>,
  ) {
    super(urlSrc, routesSrc, defaultSrc);
  }

  public value(o: OwnerType<T>): this {
    this.routesSrc.value(
      new From((routes) => {
        new Any(
          new Chain(this.urlSrc, this.defaultSrc),
          ...routes.map((r) => {
            return new Branch(
              new RegexpMatched(
                new Of(r.pattern),
                this.urlSrc,
                r.patternFlags ? new Of(r.patternFlags) : undefined,
              ),
              (typeof r.template === "object" &&
              "value" in (r.template as InformationType)
                ? r.template
                : new Of(r.template)) as TheInformation,
            );
          }),
        ).value(o as TheOwner);
      }),
    );
    return this;
  }
}
