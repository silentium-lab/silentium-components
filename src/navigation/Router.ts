import {
  patron,
  sourceChain,
  sourceFiltered,
  sourceOf,
  SourceType,
  value,
} from "silentium";
import { priority } from "../behaviors/Priority";
import { regexpMatched } from "../system/RegexpMatched";
import { shot } from "../behaviors";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  template: T | SourceType<T>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export const router = <T = "string">(
  urlSrc: SourceType<string>,
  routesSrc: SourceType<Route<T>[]>,
  defaultSrc: SourceType<T>,
) => {
  const resultSrc = sourceOf<T>();

  value(
    routesSrc,
    patron((routes) => {
      value(
        priority(
          [
            sourceChain(urlSrc, defaultSrc as T),
            ...routes.map((r) =>
              shot(
                r.template as SourceType,
                sourceFiltered(
                  regexpMatched(r.pattern, urlSrc, r.patternFlags),
                  Boolean,
                ),
              ),
            ),
          ],
          urlSrc as SourceType,
        ),
        patron(resultSrc),
      );
    }),
  );

  return resultSrc.value;
};
