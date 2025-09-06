import {
  All,
  Applied,
  Destroyable,
  From,
  InformationType,
  Lazy,
  Of,
  OwnerType,
  TheInformation,
} from "silentium";
import { BranchLazy } from "../behaviors/BranchLazy";
import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: Lazy<T>;
}

const emptySrc = new Lazy(() => new Of(false));

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export class Router<T = "string"> extends TheInformation<T> {
  private instance?: Destroyable;

  public constructor(
    private urlSrc: InformationType<string>,
    private routesSrc: InformationType<Route<T>[]>,
    private defaultSrc: Lazy<T>,
  ) {
    super(urlSrc, routesSrc, defaultSrc);
  }

  public value(o: OwnerType<T>): this {
    new All(this.routesSrc, this.urlSrc).value(
      new From(([routes, url]) => {
        if (this.instance) {
          this.instance?.destroy();
        }

        this.instance = new All(
          this.defaultSrc.get(),
          new All(
            ...routes.map(
              (r) =>
                new BranchLazy(
                  new RegexpMatched(
                    new Of(r.pattern),
                    new Of(url),
                    r.patternFlags ? new Of(r.patternFlags) : undefined,
                  ),
                  r.template,
                  emptySrc,
                ),
            ),
          ),
        );

        new Applied(
          this.instance as unknown as InformationType,
          (r: [string, (string | boolean)[]]) => {
            const firstReal = r[1].find((r) => r !== false);

            if (firstReal) {
              return firstReal as T;
            }

            return r[0];
          },
        ).value(o);
      }),
    );
    return this;
  }
}
