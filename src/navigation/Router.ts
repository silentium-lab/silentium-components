import { Any, Chain, From, Of, TheInformation, TheOwner } from "silentium";
import { Branch } from "../behaviors";
import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: T | TheInformation<T>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export class Router<T = "string"> extends TheInformation<T> {
  public constructor(
    private urlSrc: TheInformation<string>,
    private routesSrc: TheInformation<Route<T>[]>,
    private defaultSrc: TheInformation<T>,
  ) {
    super(urlSrc, routesSrc, defaultSrc);
  }

  public value(o: TheOwner<T>): this {
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
              (r.template instanceof TheInformation
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
