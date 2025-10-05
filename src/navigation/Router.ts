import {
  all,
  applied,
  DataType,
  destructor,
  DestructorType,
  of,
  ValueType,
} from "silentium";
import { branchLazy } from "../behaviors/BranchLazy";
import { regexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: ValueType<[], DataType<T>>;
}

const emptySrc = () => of(false);

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export const router = <T = "string">(
  urlSrc: DataType<string>,
  routesSrc: DataType<Route<T>[]>,
  defaultSrc: ValueType<[], DataType<T>>,
): DataType<T> => {
  return (u) => {
    const destructors: DestructorType[] = [];
    all(
      routesSrc,
      urlSrc,
    )(([routes, url]) => {
      const instance = all(
        defaultSrc(),
        all(
          ...routes.map((r) =>
            destructor(
              branchLazy(
                regexpMatched(
                  of(r.pattern),
                  of(url),
                  r.patternFlags ? of(r.patternFlags) : undefined,
                ),
                r.template,
                emptySrc,
              ),
              (d: DestructorType) => destructors.push(d),
            ),
          ),
        ),
      );

      applied(instance, (r) => {
        const firstReal = r[1].find((r) => r !== false);

        if (firstReal) {
          return firstReal as T;
        }

        return r[0];
      })(u);
    });

    return () => {
      destructors.forEach((d) => d());
    };
  };
};
