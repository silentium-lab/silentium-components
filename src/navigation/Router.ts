import { any, chain, I, Information, O } from "silentium";
import { branch } from "../behaviors";
import { regexpMatched } from "../system/RegexpMatched";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: T | Information<T>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export const router = <T = "string">(
  urlSrc: Information<string>,
  routesSrc: Information<Route<T>[]>,
  defaultSrc: Information<T>,
) => {
  return I((o) => {
    routesSrc.value(
      O((routes) => {
        any(
          chain(urlSrc, defaultSrc),
          ...routes.map((r) => {
            return branch(
              regexpMatched(
                I(r.pattern),
                urlSrc,
                (r.patternFlags && I(r.patternFlags)) || undefined,
              ),
              I(r.template as Information<T>),
            );
          }),
        ).value(o);
      }),
    );
  });
};
