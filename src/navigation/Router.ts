import {
  patron,
  sourceAny,
  sourceChain,
  sourceOf,
  SourceType,
  systemPatron,
  value,
  withPriority,
} from "silentium";
import { branch } from "../behaviors";
import { priority } from "../behaviors/Priority";
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
    systemPatron((routes) => {
      const routesBranches = [
        sourceChain(urlSrc, defaultSrc as T) as SourceType,
        ...routes.map((r) =>
          value(
            branch(
              regexpMatched(r.pattern, urlSrc, r.patternFlags),
              r.template as SourceType,
            ),
            systemPatron((v) => {
              return v;
            }),
          ),
        ),
      ];
      value(priority(routesBranches, sourceAny(routesBranches)), [
        withPriority(<any>patron(resultSrc), 150),
        withPriority(
          <any>patron((v) => {
            return v;
          }),
          150,
        ),
      ]);
    }),
  );

  return resultSrc.value;
};
