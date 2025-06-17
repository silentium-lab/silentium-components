import {
  firstVisit,
  GuestType,
  patronOnce,
  sourceOf,
  SourceType,
  systemPatron,
  value,
} from "silentium";
import { branch } from "../behaviors";
import { polling } from "../behaviors/Polling";
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

  const visited = firstVisit(() => {
    value(
      routesSrc,
      patronOnce((routes) => {
        const prioritySrc = priority([
          defaultSrc,
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
        ]);
        const pollingSrc = polling(prioritySrc, urlSrc);
        value(pollingSrc, systemPatron(resultSrc));
      }),
    );
  });

  return (g: GuestType<T>) => {
    visited();
    resultSrc.value(g);
  };
};
