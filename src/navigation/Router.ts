import {
  All,
  Applied,
  EventType,
  Destructor,
  DestructorType,
  Of,
  ConstructorType,
  Event,
  Transport,
} from "silentium";
import { RegexpMatched } from "../system";
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
export function Router<T = "string">(
  urlSrc: EventType<string>,
  routesSrc: EventType<Route<T>[]>,
  defaultSrc: ConstructorType<[], EventType<T>>,
): EventType<T> {
  return Event((user) => {
    const destructors: DestructorType[] = [];
    const destroyAllData = () => {
      destructors.forEach((d) => d());
      destructors.length = 0;
    };
    All(routesSrc, urlSrc).event(
      Transport(([routes, url]) => {
        destroyAllData();
        const instance = All(
          defaultSrc(),
          All(
            ...routes.map(
              (r) =>
                Destructor(
                  BranchLazy(
                    RegexpMatched(
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
          const firstReal = r[1].find((r: unknown) => r !== false);

          if (firstReal) {
            return firstReal as T;
          }

          return r[0];
        }).event(user);
      }),
    );

    return destroyAllData;
  });
}
