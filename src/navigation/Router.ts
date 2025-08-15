import { any, chain, i, InformationType, OwnerType } from "silentium";
import { branch } from "../behaviors";
import { regexpMatched } from "../system/RegexpMatched";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: T | InformationType<T>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export const router = <T = "string">(
  urlSrc: InformationType<string>,
  routesSrc: InformationType<Route<T>[]>,
  defaultSrc: InformationType<T>,
): InformationType<T> => {
  return (o) => {
    routesSrc((routes) => {
      any(
        chain(urlSrc, defaultSrc),
        ...routes.map((r) => {
          return branch(
            regexpMatched(
              i(r.pattern),
              urlSrc,
              r.patternFlags ? i(r.patternFlags) : undefined,
            ),
            (typeof r.template === "function"
              ? r.template
              : i(r.template)) as InformationType,
          );
        }),
      )(o as OwnerType<unknown>);
    });
  };
};
