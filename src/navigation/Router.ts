import {
  all,
  applied,
  EventType,
  destructor,
  DestructorType,
  of,
  ConstructorType,
} from "silentium";
import { regexpMatched } from "../system";
import { branchLazy } from "../behaviors";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: ConstructorType<[], EventType<T>>;
}

const emptySrc = () => of(false);

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export const router = <T = "string">(
  urlSrc: EventType<string>,
  routesSrc: EventType<Route<T>[]>,
  defaultSrc: ConstructorType<[], EventType<T>>,
): EventType<T> => {
  return (u) => {
    const destructors: DestructorType[] = [];
    const destroyAllData = () => {
      destructors.forEach((d) => d());
      destructors.length = 0;
    };
    all(
      routesSrc,
      urlSrc,
    )(([routes, url]) => {
      destroyAllData();
      const instance = all(
        defaultSrc(),
        all(
          ...routes.map(
            (r) =>
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
              ).value,
          ),
        ),
      );

      // Return first not false or default
      applied(instance, (r) => {
        const firstReal = r[1].find((r) => r !== false);

        if (firstReal) {
          return firstReal as T;
        }

        return r[0];
      })(u);
    });

    return destroyAllData;
  };
};
