import {
  Any,
  Chain,
  From,
  InformationType,
  Lazy,
  Of,
  OwnerType,
  TheInformation,
  TheOwner,
} from "silentium";
import { RegexpMatched } from "../system";
import { BranchLazy } from "../behaviors/BranchLazy";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: Lazy<T>;
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
            return new BranchLazy(
              new RegexpMatched(
                new Of(r.pattern),
                this.urlSrc,
                r.patternFlags ? new Of(r.patternFlags) : undefined,
              ),
              r.template,
            );
          }),
        ).value(o as TheOwner);
      }),
    );
    return this;
  }
}
