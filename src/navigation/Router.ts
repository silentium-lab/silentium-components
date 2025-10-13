import {
  All,
  Applied,
  EventType,
  Destructor,
  DestructorType,
  Of,
  ConstructorType,
} from "silentium";
import { regexpMatched } from "../system";
import { BranchLazy } from "../behaviors";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: ConstructorType<[], EventType<T>>;
}

const emptySrc = () => Of(false);

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
    All(
      routesSrc,
      urlSrc,
    )(([routes, url]) => {
      destroyAllData();
      const instance = All(
        defaultSrc(),
        All(
          ...routes.map(
            (r) =>
              Destructor(
                BranchLazy(
                  regexpMatched(
                    Of(r.pattern),
                    Of(url),
                    r.patternFlags ? Of(r.patternFlags) : undefined,
                  ),
                  r.template,
                  emptySrc,
                ),
                (d: DestructorType) => destructors.push(d),
              ).event,
          ),
        ),
      );

      // Return first not false or default
      Applied(instance, (r) => {
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
