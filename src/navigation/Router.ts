import {
  patron,
  sourceAny,
  sourceChain,
  sourceFiltered,
  sourceOf,
  SourceType,
  value,
} from "silentium";
import { regexpMatched } from "../system/RegexpMatched";

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
        sourceAny([
          sourceChain(urlSrc, defaultSrc as T),
          ...routes.map((r) =>
            sourceChain(
              sourceFiltered(
                regexpMatched(r.pattern, urlSrc, r.patternFlags),
                Boolean,
              ),
              r.template,
            ),
          ),
        ]),
        patron(resultSrc),
      );
    }),
  );

  return resultSrc.value;
};
